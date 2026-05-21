import { asyncHandler } from "../src/utils/asyncHandler.js";
import { ApiError } from "../src/utils/ApiError.js";
import { prisma } from "../lib/prisma.js";
import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";

export const verifyJWT = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token =
            req.cookies?.accessToken ||
            req.header("Authorization")?.replace("Bearer ", "");

        if (!token) throw new ApiError(401, "Unauthorized request");

        // ✅ id not _id (Prisma uses id)
        const decodedToken = jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET as string
        ) as JwtPayload & { id: string };

        // ✅ findUnique instead of findById, exclude sensitive fields
        const user = await prisma.user.findUnique({
            where: { id: decodedToken.id },
            select: {
                id: true,
                username: true,
                email: true,
                role: true,
                createdAt: true
            }
        });

        if (!user) throw new ApiError(401, "Invalid access token");

        req.user = user;
        next();

    } catch (error) {
        if (error instanceof Error)
            throw new ApiError(401, error.message || "Invalid access token");
    }
});

export const isAdmin = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user) throw new ApiError(401, "User does not exist");

        // ✅ role is an enum in Prisma so compare with enum value
        if (req.user.role !== "ADMIN") {
            throw new ApiError(403, "User is not an admin");
        }

        next();

    } catch (error) {
        if (error instanceof Error)
            throw new ApiError(500, error.message || "Forbidden: Not an admin");
    }
});