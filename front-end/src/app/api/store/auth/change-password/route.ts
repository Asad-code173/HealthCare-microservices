
import { proxyRequest } from "@/lib/storeApi";

export async function PATCH(request: Request) {  
  return proxyRequest(request, "/auth/change-password");
}