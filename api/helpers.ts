import { IncomingMessage, ServerResponse } from "http";

export interface ResponseWithMethods extends ServerResponse {
  json?: (data: any) => ResponseWithMethods;
  status?: (code: number) => ResponseWithMethods;
}

export function parseBody(req: IncomingMessage): Promise<any> {
  return new Promise((resolve) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        resolve({});
      }
    });
  });
}

export function wrapResponse(res: ServerResponse): ResponseWithMethods {
  let statusCode = 200;

  (res as ResponseWithMethods).json = function (data: any) {
    this.setHeader("Content-Type", "application/json");
    this.statusCode = statusCode;
    this.end(JSON.stringify(data));
    return this;
  };

  (res as ResponseWithMethods).status = function (code: number) {
    statusCode = code;
    return this;
  };

  return res as ResponseWithMethods;
}

export function setupCORS(res: ServerResponse) {
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,PATCH,DELETE,POST,PUT",
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token,X-Forwarded-Host,X-URL-Scheme,x-middleware-preflight,Accept,Accept-Version,Content-Length,Content-MD5,Content-Type,Date,X-Api-Version",
  );
}

export function parseQueryString(req: IncomingMessage): Record<string, any> {
  const url = new URL(req.url || "", "http://localhost");
  const params: Record<string, any> = {};

  for (const [key, value] of url.searchParams) {
    params[key] = value;
  }

  return params;
}

export function parsePathParams(req: IncomingMessage & { url?: string }): Record<string, string> {
  const url = req.url || "";
  const pathname = url.split("?")[0];
  const segments = pathname.split("/").filter(Boolean);
  
  // For /api/products/[slug], segments would be: ['api', 'products', 'slug']
  // For /api/orders/[orderId], segments would be: ['api', 'orders', 'orderId']
  const params: Record<string, string> = {};
  
  // Extract the last segment as the ID/slug if we're in a nested route
  if (segments.length >= 3 && segments[0] === "api") {
    const resource = segments[1]; // 'products', 'orders', etc.
    const idOrSlug = segments[2]; // the actual ID or slug
    
    if (resource === "products" || resource === "orders" || resource === "collections") {
      params.id = idOrSlug;
    }
  }
  
  // Handle deeper nested routes like /api/orders/[orderId]/status
  if (segments.length >= 4 && segments[0] === "api") {
    const action = segments[3];
    params.action = action;
  }
  
  return params;
}
