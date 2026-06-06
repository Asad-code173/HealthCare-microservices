import express from "express"
import type { Express } from "express";
import cookieParser from 'cookie-parser';
import cors from 'cors'

const app: Express = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
    methods: ['GET','POST','DELETE','PATCH','PUT']
}));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use(express.static("public"));
app.use(cookieParser());

// ✅ Health check endpoint — Kubernetes probe ke liye
app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok" });
});

import userRouter from "./routes/Userroute.js"
app.use("/api/v1/users", userRouter)

export {app}