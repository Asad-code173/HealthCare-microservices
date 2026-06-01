import { NextResponse } from "next/server";

const GATEWAY_SERVICE_URL =
  process.env.API_BASE_URL || "http://gateway-service:8080";


async function buildResponse(response: Response) {
  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    const payload = await response.json().catch(() => ({}));

    return NextResponse.json(payload, { status: response.status });
  }

  const text = await response.text();



  return new NextResponse(text, {
    status: response.status,
    headers: { "content-type": contentType || "text/plain" },
  });
}

export async function proxyRequest(request: Request, path: string) {

  try {
    const targetUrl = `${GATEWAY_SERVICE_URL}${path}`;
    console.log("ENV URL:", process.env.API_BASE_URL);
    console.log("FINAL URL:", targetUrl);

    const body =
      request.method === "GET" || request.method === "HEAD"
        ? undefined
        : await request.text();

    const response = await fetch(targetUrl, {
      method: request.method,
      headers: {
        "content-type":
          request.headers.get("content-type") || "application/json",

        "authorization":
          request.headers.get("authorization") || "",


        "cookie":
          request.headers.get("cookie") || "",
      },
      body,
      cache: "no-store",
    });

    const nextResponse = await buildResponse(response);

    const setCookies = response.headers.getSetCookie?.() ?? [];
    setCookies.forEach(cookie => nextResponse.headers.append("set-cookie", cookie));

    return nextResponse;

  } catch (error) {
    console.error("Gateway Proxy Error:", error);
    return NextResponse.json({ message: "Gateway service unavailable" }, { status: 503 });
  }
}

export async function proxyGet(path: string, request?: Request) {
  try {
    const targetUrl = `${GATEWAY_SERVICE_URL}${path}`;

    const response = await fetch(targetUrl, {
      method: "GET",
      headers: {
        "authorization":
          request?.headers.get("authorization") || "",

        "cookie":
          request?.headers.get("cookie") || "",
      },
      cache: "no-store",
    });

    const nextResponse = await buildResponse(response);

    const setCookies = response.headers.getSetCookie?.() ?? [];
    setCookies.forEach(cookie => nextResponse.headers.append("set-cookie", cookie));
    return nextResponse;

  } catch (error) {
    console.error("Gateway Proxy Error:", error);

    return NextResponse.json(
      { message: "Gateway service unavailable" },
      { status: 503 }
    );
  }
}