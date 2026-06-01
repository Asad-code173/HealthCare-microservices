import jwt from "jsonwebtoken";
// lib/tokens.ts

interface TokenPayload {
    id: string;
    email: string;
    username: string; 
    role: string;
}

export const generateAccessToken = function(payload: TokenPayload){
    return jwt.sign(
        {
            id: payload.id,
            email: payload.email,
            username: payload.username, 
            role: payload.role,
        },
        process.env.ACCESS_TOKEN_SECRET!,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY!
        }
    );
};
export const generateRefreshToken = function(userId: string){
    return jwt.sign(
        { id: userId },
        process.env.REFRESH_TOKEN_SECRET!,

        { expiresIn: process.env.REFRESH_TOKEN_EXPIRY! }
    );
};