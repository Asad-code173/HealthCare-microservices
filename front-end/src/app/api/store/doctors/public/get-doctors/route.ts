// /api/store/doctors/public/get-doctors/route.ts
import {proxyRequest } from "@/lib/storeApi";

export async function GET(request:Request) {
  return proxyRequest(request, "/api/v1/doctors");
}