import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import { validateEnv, logValidationResults } from "./lib/env-validator.js";
import { securityHeaders, sanitiseBody, rateLimit } from "./lib/security.js";
import { handleDemo } from "./routes/demo.js";
import { trackVisitor, getVisitorStats, getVisitorTrend } from "./routes/analytics.js";
import { uploadFile } from "./routes/upload.js";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  addProductImage,
  removeProductImage,
  bulkImportProducts,
} from "./routes/products.js";
import {
  getCollections,
  getCollectionById,
  createCollection,
  updateCollection,
  deleteCollection,
} from "./routes/collections.js";
import {
  handleContact,
  getContactMessages,
  markMessageAsRead,
} from "./routes/contact.js";
import {
  createOrder,
  getOrders,
  getOrderByPanierCode,
  getOrderById,
  searchOrders,
  updateOrderStatus,
  getOrdersByStatus,
  updateOrder,
  deleteOrder,
} from "./routes/orders.js";
import {
  getHeroSlides,
  createHeroSlide,
  updateHeroSlide,
  deleteHeroSlide,
} from "./routes/slides.js";
import {
  createQuoteRequest,
  getQuoteRequests,
  getQuoteRequestById,
  updateQuoteRequestStatus,
  deleteQuoteRequest,
} from "./routes/quotes.js";
import {
  getProductDetails,
  upsertProductDetails,
  deleteProductDetail,
} from "./routes/product-details.js";
import productRecommendationsRouter from "./routes/product-recommendations.js";
import subscribersRouter from "./routes/subscribers.js";

const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map((o) => o.trim())
  : ["https://luxence.fr", "https://www.luxence.fr"];

export function createServer() {
  const envValidation = validateEnv();
  logValidationResults(envValidation);

  if (!envValidation.valid) {
    console.error("Server initialization failed due to invalid environment configuration.");
    if (process.env.NODE_ENV === "production") {
      throw new Error("Invalid environment configuration");
    }
  }

  const app = express();

  // ── Security headers (before anything else) ──────────────────────────────
  app.use(securityHeaders());

  // ── CORS — whitelist only ─────────────────────────────────────────────────
  app.use(
    cors({
      origin: (origin, cb) => {
        // Allow server-to-server / curl requests (no origin) and whitelisted origins
        if (!origin || ALLOWED_ORIGINS.includes(origin)) return cb(null, true);
        cb(new Error(`CORS: origin '${origin}' not allowed`));
      },
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization", "X-Filename"],
      credentials: false,
    }),
  );

  // ── Body parsers — tight limits for JSON, generous only for upload ─────────
  app.use((req, res, next) => {
    // Upload route needs raw streaming — skip body-parser for it
    if (req.path === "/api/upload") return next();
    express.json({ limit: "2mb" })(req, res, next);
  });
  app.use((req, res, next) => {
    if (req.path === "/api/upload") return next();
    express.urlencoded({ limit: "2mb", extended: true })(req, res, next);
  });

  // ── Input sanitisation (strip null bytes) ─────────────────────────────────
  app.use(sanitiseBody());

  // ── Global rate limit: 200 req / 15 min per IP ───────────────────────────
  app.use(rateLimit(200, 15 * 60 * 1000, "global"));

  // ── Routes ────────────────────────────────────────────────────────────────

  app.get("/api/ping", (_req, res) => {
    res.json({ message: process.env.PING_MESSAGE ?? "ping" });
  });

  app.get("/api/demo", handleDemo);

  // Analytics — stricter limit on track-visitor (once per visitor is enough)
  app.post(
    "/api/analytics/track-visitor",
    rateLimit(10, 60 * 1000, "track-visitor"),
    trackVisitor,
  );
  app.get("/api/analytics/visitors", getVisitorStats);
  app.get("/api/analytics/trend", getVisitorTrend);

  // Upload — 20 uploads / 15 min
  app.post("/api/upload", rateLimit(20, 15 * 60 * 1000, "upload"), uploadFile);

  // Products
  app.get("/api/products", getProducts);
  app.get("/api/products/:id", getProductById);
  app.post("/api/products/bulk-import", bulkImportProducts);
  app.post("/api/products", createProduct);
  app.put("/api/products/:id", updateProduct);
  app.delete("/api/products/:id", deleteProduct);
  app.post("/api/products/:id/images", addProductImage);
  app.delete("/api/products/:id/images", removeProductImage);

  // Collections
  app.get("/api/collections", getCollections);
  app.get("/api/collections/:id", getCollectionById);
  app.post("/api/collections", createCollection);
  app.put("/api/collections/:id", updateCollection);
  app.delete("/api/collections/:id", deleteCollection);

  // Subscribers
  app.use("/api", subscribersRouter);

  // Contact — 10 messages / 15 min to prevent spam
  app.post("/api/contact", rateLimit(10, 15 * 60 * 1000, "contact"), handleContact);
  app.get("/api/contact/messages", getContactMessages);
  app.put("/api/contact/messages/:id/read", markMessageAsRead);

  // Orders — 30 submissions / 15 min
  app.post("/api/orders", rateLimit(30, 15 * 60 * 1000, "orders"), createOrder);
  app.get("/api/orders", getOrders);
  app.get("/api/orders/search", searchOrders);
  app.get("/api/orders/status/:status", getOrdersByStatus);
  app.get("/api/orders/panier/:panierCode", getOrderByPanierCode);
  app.get("/api/orders/:id", getOrderById);
  app.put("/api/orders/:id/status", updateOrderStatus);
  app.put("/api/orders/:id", updateOrder);
  app.delete("/api/orders/:id", deleteOrder);

  // Hero slides
  app.get("/api/slides", getHeroSlides);
  app.post("/api/slides", createHeroSlide);
  app.put("/api/slides/:id", updateHeroSlide);
  app.delete("/api/slides/:id", deleteHeroSlide);

  // Quote requests — 20 / 15 min
  app.post("/api/quotes", rateLimit(20, 15 * 60 * 1000, "quotes"), createQuoteRequest);
  app.get("/api/quotes", getQuoteRequests);
  app.get("/api/quotes/:id", getQuoteRequestById);
  app.put("/api/quotes/:id/status", updateQuoteRequestStatus);
  app.delete("/api/quotes/:id", deleteQuoteRequest);

  // Product details
  app.get("/api/products/:productId/details", getProductDetails);
  app.put("/api/products/:productId/details", upsertProductDetails);
  app.delete("/api/products/:productId/details/:sectionId", deleteProductDetail);

  // Product recommendations
  app.use("/api/products", productRecommendationsRouter);

  // Static files
  app.use(express.static(path.join(process.cwd(), "public")));

  // ── Global error handler — never leak stack traces ────────────────────────
  app.use((err: any, _req: any, res: any, _next: any) => {
    const isDev = process.env.NODE_ENV !== "production";
    console.error(err);
    res.status(err.status ?? 500).json({
      success: false,
      error: isDev ? err.message : "Une erreur interne est survenue.",
    });
  });

  return app;
}
