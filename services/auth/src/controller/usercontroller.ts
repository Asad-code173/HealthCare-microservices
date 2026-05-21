import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { prisma } from "../../lib/prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import type { Request, Response} from "express";
import type { RegisterUserBody, LoginUserBody } from "../types/Auth.js";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt.js";

// ─── Helper ───────────────────────────────────────────────────────────────────

const generateAccessAndRefreshTokens = async (
    userId: string
): Promise<{ accessToken: string; refreshToken: string }> => {
    try {
        const user = await prisma.user.findUnique({ where: { id: userId } });

        if (!user) throw new ApiError(404, "User not found");

        const accessToken = generateAccessToken(user.id);
        const refreshToken = generateRefreshToken(user.id);

        await prisma.user.update({
            where: { id: user.id },
            data: { refreshToken }
        });

        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating access and refresh tokens");
    }
};

// Register 

const registerUser = asyncHandler(async (req: Request<{}, {}, RegisterUserBody>, res: Response) => {
    const { username, email, password } = req.body;

    if ([username, email, password].some((f) => !f?.trim())) {
        throw new ApiError(400, "All fields are required");
    }

    const existedUser = await prisma.user.findFirst({
        where: { OR: [{ email }, { username }] }
    });

    if (existedUser) throw new ApiError(409, "User with email or username already exists");

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
        data: {
            username: username.toLowerCase(),
            email,
            password: hashedPassword
        },
        select: { id: true, username: true, email: true, role: true, createdAt: true }
    });

    return res.status(201).json(
        new ApiResponse(201, user, "User registered successfully")
    );
});

// Login 

const loginUser = asyncHandler(async (req: Request<{}, {}, LoginUserBody>, res: Response) => {
    const { email, username, password } = req.body;

    if (!(email || username)) {
        throw new ApiError(400, "Username or email is required");
    }

    const user = await prisma.user.findFirst({
        where: { OR: [{ email }, { username }] }
    });

    if (!user) throw new ApiError(404, "Invalid username or email");

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new ApiError(401, "Invalid user credentials");

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user.id);

    const loggedInUser = await prisma.user.findUnique({
        where: { id: user.id },
        select: { id: true, username: true, email: true, role: true, createdAt: true }
    });

    const options = { httpOnly: true, secure: true, sameSite: "none" as const };

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(200, { user: loggedInUser, accessToken, refreshToken }, "User logged in successfully"));
});

//  Logout 

const logoutUser = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw new ApiError(401, "User is not authenticated");

    // $unset refreshToken → set to null in Prisma
    await prisma.user.update({
        where: { id: req.user.id },
        data: { refreshToken: null }
    });

    const options = { httpOnly: true, secure: true, sameSite: "none" as const };

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged out successfully"));
});

//  Refresh Acces Token 

const refreshAccessToken = asyncHandler(async (req: Request, res: Response) => {
    const incomingRefreshToken = req.cookies?.refreshToken || req.body?.refreshToken;

    if (!incomingRefreshToken) throw new ApiError(401, "Unauthorized request");

    try {
        const decodedToken = jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET!) as { id: string }; 

        const user = await prisma.user.findUnique({ where: { id: decodedToken.id } });

        if (!user) throw new ApiError(401, "Invalid refresh token");

        if (incomingRefreshToken !== user.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used");
        }

        const { accessToken, refreshToken: newRefreshToken } = await generateAccessAndRefreshTokens(user.id);

        const options = { httpOnly: true, secure: true, sameSite: "none" as const };

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json(new ApiResponse(200, { accessToken, refreshToken: newRefreshToken }, "Access token refreshed"));

    } catch (error) {
        if (error instanceof Error)
            throw new ApiError(401, error.message || "Invalid refresh token");
    }
});

// ─── Change Password ──────────────────────────────────────────────────────────

const changeCurrentPassword = asyncHandler(async (req: Request, res: Response) => {
    const { oldPassword, newPassword } = req.body;

    if (!req.user) throw new ApiError(401, "User is not authenticated");

    const user = await prisma.user.findUnique({ where: { id: req.user.id } });

    if (!user) throw new ApiError(404, "User not found");

    const isPasswordCorrect = await bcrypt.compare(oldPassword, user.password);

    if (!isPasswordCorrect) throw new ApiError(400, "Invalid old password");

    // ✅ No .save() in Prisma — use update
    await prisma.user.update({
        where: { id: user.id },
        data: { password: await bcrypt.hash(newPassword, 10) }
    });

    return res.status(200).json(new ApiResponse(200, {}, "Password changed successfully"));
});

// ─── Admin ────────────────────────────────────────────────────────────────────

const getAdminDashboard = asyncHandler(async (req: Request, res: Response) => {
    return res.status(200).json({ message: "Welcome Admin" });
});

// ─── Exports ──────────────────────────────────────────────────────────────────

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getAdminDashboard
};