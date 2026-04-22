/**
 * Vercel serverless function handler for all API routes
 * This wraps the Express server using serverless-http
 */
import serverless from "serverless-http";
import { createServer } from "../server/index.js";

// Create the Express app once (module-level caching)
const app = createServer();

// Wrap the app with serverless-http
// serverless-http automatically converts Vercel's event/context to Express req/res
const handler = serverless(app, {
  binary: ['image/*', 'application/pdf'],
});

// Export the handler for Vercel
export default handler;
