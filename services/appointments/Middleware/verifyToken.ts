import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../src/utils/asyncHandler.js";
import { ApiError } from "../src/utils/ApiError.js";



type AuthUser = {
    id: string;
    role: "ADMIN" | "USER";
    email: string;
    username:string,
};

export const verifyToken = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const token = req.cookies?.accessToken ||
        req.header("Authorization")?.replace("Bearer ","")

        if (!token) {
            throw new ApiError(401, "No token provided");
        }

        const decoded = jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET as string
        );

        if (!decoded || typeof decoded === "string") {
            throw new ApiError(401, "Invalid access token");
        }

        req.user = decoded as AuthUser;

        next();
    }
);
export const isAdmin = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) throw new ApiError(401, "User does not exist");

    if (req.user.role !== "ADMIN") {
        throw new ApiError(403, "User is not an admin");
    }

    next();
});