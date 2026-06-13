import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const publicRoutes = [
  "/sign-in",
  "/sign-up",
 
];

const adminRoutes = ["/admin"];
const patientRoutes = ["/patient"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token =
    request.cookies.get("accessToken")?.value;

  const isPublicRoute =
    publicRoutes.includes(pathname);

  const isAdminRoute = adminRoutes.some((route) =>
    pathname.startsWith(route)
  );

  const isPatientRoute =
    patientRoutes.some((route) =>
      pathname.startsWith(route)
    );

  // 1. NOT LOGGED IN
  if (!token && !isPublicRoute) {
    return NextResponse.redirect(
      new URL("/sign-in", request.url)
    );
  }

  let role: string | undefined;

  // 2. VERIFY TOKEN
  if (token) {
    try {
      const secret = new TextEncoder().encode(
        process.env.ACCESS_TOKEN_SECRET
      );

      const { payload } = await jwtVerify(
        token,
        secret
      );

      role = payload.role as string;
      console.log("Role",role)

    } catch (error) {
      return NextResponse.redirect(
        new URL("/sign-in", request.url)
      );
    }
  }

  // 3. ADMIN GUARD
  if (isAdminRoute && role !== "ADMIN") {
    return NextResponse.redirect(
      new URL("/patient/dashboard", request.url)
    );
  }

  // 4. PATIENT GUARD
  if (isPatientRoute && role !== "PATIENT") {
    return NextResponse.redirect(
      new URL("/admin/dashboard", request.url)
    );
  }

  // 5. AUTH PAGES REDIRECT
  if (token && isPublicRoute) {
    return NextResponse.redirect(
      new URL(role === "ADMIN" ? "/admin/dashboard": "/patient/dashboard",request.url)
    );
  }


  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next|api/health|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)((?!/health).*)",
  ],
};