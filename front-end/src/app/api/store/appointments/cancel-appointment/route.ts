import { proxyRequest } from "@/lib/storeApi";

export async function PATCH(request: Request) {
  const body = await request.json();
  const { id } = body;

  const newRequest = new Request(request.url, {
    method: "PATCH",
    headers: request.headers,
    body: JSON.stringify(body),
  });

  return proxyRequest(newRequest, `/api/v1/appointments/${id}/cancel`);
}