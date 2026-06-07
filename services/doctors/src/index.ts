import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import { app } from "./app.js";
import { prisma } from "../lib/prisma.js";

const PORT = process.env.PORT || 8002;

async function startServer() {
    try {
        await prisma.$connect();
        console.log("Database connected");

        app.listen(PORT, () => {
            console.log(`Server is running at port: ${PORT}`);
        });
    } catch (error) {
        console.error("Server failed to start:", error);
        process.exit(1);
    }
}

startServer();