import { IncomingMessage, ServerResponse } from "http";
import {
  parseBody,
  wrapResponse,
  setupCORS,
  parseQueryString,
} from "./helpers.js";
import {
  getCollections,
  getCollectionById,
  createCollection,
  updateCollection,
  deleteCollection,
} from "../server/routes/collections.js";

export const config = {
  runtime: "nodejs",
};

export default async (
  req: IncomingMessage & {
    query?: Record<string, any>;
    body?: any;
    params?: Record<string, any>;
  },
  res: ServerResponse,
) => {
  // Wrap response with Express-style methods
  const wrappedRes = wrapResponse(res);

  // Enable CORS
  setupCORS(res);

  if (req.method === "OPTIONS") {
    res.statusCode = 200;
    res.end();
    return;
  }

  try {
    // Parse request body
    req.body = await parseBody(req);

    // Parse query string
    req.query = parseQueryString(req);
    const { id } = req.query;
    req.params = {};

    // Route based on method
    if (req.method === "GET") {
      // GET /api/collections - get all collections
      if (!id) {
        return getCollections(req as any, wrappedRes as any);
      }

      // GET /api/collections/:id - get collection by ID or slug
      if (id) {
        req.params = { id: id as string };
        return getCollectionById(req as any, wrappedRes as any);
      }

      return wrappedRes.status(400).json({ error: "Invalid query parameters" });
    }

    if (req.method === "POST") {
      // POST /api/collections - create collection
      return createCollection(req as any, wrappedRes as any);
    }

    if (req.method === "PUT") {
      // PUT /api/collections/:id - update collection
      if (id) {
        req.params = { id: id as string };
        return updateCollection(req as any, wrappedRes as any);
      }

      return wrappedRes
        .status(400)
        .json({ error: "Collection ID is required" });
    }

    if (req.method === "DELETE") {
      // DELETE /api/collections/:id - delete collection
      if (id) {
        req.params = { id: id as string };
        return deleteCollection(req as any, wrappedRes as any);
      }

      return wrappedRes
        .status(400)
        .json({ error: "Collection ID is required" });
    }

    return wrappedRes.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("API error:", error);
    return wrappedRes
      .status(500)
      .json({ error: "Internal server error", details: String(error) });
  }
};
