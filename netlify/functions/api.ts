import serverless from "serverless-http";

import { createServer } from "../../server";

// Lazy initialization to avoid errors during module loading in serverless environments
let serverHandler: any = null;

function getHandler() {
  if (!serverHandler) {
    try {
      serverHandler = serverless(createServer());
    } catch (error) {
      console.error("Failed to initialize server:", error);
      // Return a fallback error handler if server initialization fails
      return async (event: any, context: any) => {
        return {
          statusCode: 500,
          body: JSON.stringify({
            error: "Server initialization failed",
            message: error instanceof Error ? error.message : "Unknown error",
          }),
        };
      };
    }
  }
  return serverHandler;
}

export const handler = async (event: any, context: any) => {
  return getHandler()(event, context);
};
