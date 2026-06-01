
import { proxyRequest } from "@/lib/storeApi";

export async function POST(request: Request) {
  return proxyRequest(request, "/auth/refresh-token");
}