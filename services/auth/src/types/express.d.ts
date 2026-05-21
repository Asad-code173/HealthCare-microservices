import { User } from "@prisma/client";

declare global {
    namespace Express {
        interface Request {
        user?: {
                id: string;
                username: string;
                email: string;
                role: "ADMIN" | "PATIENT";
                createdAt: Date;
            };
        }
    }
}