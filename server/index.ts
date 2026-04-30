import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import { validateEnv, logValidationResults } from "./lib/env-validator.js";
import { handleDemo } from "./routes/demo.js";
import { uploadFile } from "./routes/upload.js";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  addProductImage,
  removeProductImage,
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
import {
  getProductRecommendations,
  upsertProductRecommendations,
} from "./routes/product-recommendations.js";

import subscribersRouter from "./routes/subscribers.js";

export function createServer() {
  const envValidation = validateEnv();
  logValidationResults(envValidation);

  if (!envValidation.valid) {
    console.error(
      "Server initialization failed due to invalid environment configuration.",
    );
    console.error("Please fix the errors above and restart the server.");

    if (process.env.NODE_ENV === "production") {
      throw new Error("Invalid environment configuration");
    }
  }

  const app = express();

  app.use(cors());
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  app.post("/api/upload", uploadFile);

  // Products routes
  app.get("/api/products", getProducts);
  app.get("/api/products/:id", getProductById);
  app.post("/api/products", createProduct);
  app.put("/api/products/:id", updateProduct);
  app.delete("/api/products/:id", deleteProduct);
  app.post("/api/products/:id/images", addProductImage);
  app.delete("/api/products/:id/images", removeProductImage);

  // Collections routes
  app.get("/api/collections", getCollections);
  app.get("/api/collections/:id", getCollectionById);
  app.post("/api/collections", createCollection);
  app.put("/api/collections/:id", updateCollection);
  app.delete("/api/collections/:id", deleteCollection);

  // Subscribers routes
  app.use("/api", subscribersRouter);

  // Contact routes
  app.post("/api/contact", handleContact);
  app.get("/api/contact/messages", getContactMessages);
  app.put("/api/contact/messages/:id/read", markMessageAsRead);

  // Orders routes
  app.post("/api/orders", createOrder);
  app.get("/api/orders", getOrders);
  app.get("/api/orders/search", searchOrders);
  app.get("/api/orders/status/:status", getOrdersByStatus);
  app.get("/api/orders/panier/:panierCode", getOrderByPanierCode);
  app.get("/api/orders/:id", getOrderById);
  app.put("/api/orders/:id/status", updateOrderStatus);
  app.put("/api/orders/:id", updateOrder);
  app.delete("/api/orders/:id", deleteOrder);

  // Hero slides routes
  app.get("/api/slides", getHeroSlides);
  app.post("/api/slides", createHeroSlide);
  app.put("/api/slides/:id", updateHeroSlide);
  app.delete("/api/slides/:id", deleteHeroSlide);

  // Quote requests routes
  app.post("/api/quotes", createQuoteRequest);
  app.get("/api/quotes", getQuoteRequests);
  app.get("/api/quotes/:id", getQuoteRequestById);
  app.put("/api/quotes/:id/status", updateQuoteRequestStatus);
  app.delete("/api/quotes/:id", deleteQuoteRequest);

  // Product details routes
  app.get("/api/products/:productId/details", getProductDetails);
  app.put("/api/products/:productId/details", upsertProductDetails);
  app.delete(
    "/api/products/:productId/details/:sectionId",
    deleteProductDetail,
  );

  // Product recommendations routes
  app.get("/api/products/:productId/recommendations", getProductRecommendations);
  app.put("/api/products/:productId/recommendations", upsertProductRecommendations);

  app.use(express.static(path.join(process.cwd(), "public")));

  return app;
}
