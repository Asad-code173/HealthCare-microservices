import { proxyRequest } from "@/lib/storeApi";

export async function POST(request: Request) {
  return proxyRequest(request, "/api/v1/doctors/upload-url");
}