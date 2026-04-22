import { DemoResponse } from "@shared/api";

export async function handleDemo(req: any, res: any) {
  const response: DemoResponse = {
    message: "Hello from Express server",
  };
  res.status(200).json(response);
}
