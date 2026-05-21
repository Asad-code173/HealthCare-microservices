import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { prisma } from "../../lib/prisma.js";
import { generatePresignedUrl, deleteFromS3 } from "../utils/s3.js";
import type { Request, Response } from "express";
import type { IdParam } from "../types/doctor.js"



// ─── Get Presigned URL (Admin) ────────────────────────────────────────────────

const getUploadUrl = asyncHandler(async (req: Request, res: Response) => {
    const { fileType } = req.body; // e.g. "image/jpeg"

    if (!fileType) throw new ApiError(400, "File type is required");

    const { presignedUrl, avatarUrl } = await generatePresignedUrl(fileType);

    return res.status(200).json(
        new ApiResponse(200, { presignedUrl, avatarUrl }, "Presigned URL generated")
    );
});

// ─── Create Doctor (Admin) ────────────────────────────────────────────────────

const createDoctor = asyncHandler(async (req: Request, res: Response) => {
    const { name, specialization, email, phone, experience, workingDays, workingHours, avatar } = req.body;

    if ([name, specialization, email].some((f) => !f?.trim())) {
        throw new ApiError(400, "Name, specialization and email are required");
    }

    const existedDoctor = await prisma.doctor.findUnique({ where: { email } });
    if (existedDoctor) throw new ApiError(409, "Doctor with this email already exists");

    const doctor = await prisma.doctor.create({
        data: {
            name,
            specialization,
            email,
            phone: phone ?? null,
            experience: parseInt(experience),
            workingDays: workingDays || [],
            workingHours: workingHours || { start: "09:00", end: "17:00" },
            avatar: avatar ?? null, // S3 URL from frontend
        }
    });

    return res.status(201).json(
        new ApiResponse(201, doctor, "Doctor created successfully")
    );
});

// ─── Get All Doctors (Public) ─────────────────────────────────────────────────

const getAllDoctors = asyncHandler(async (req: Request, res: Response) => {
    const doctors = await prisma.doctor.findMany({
        select: {
            id: true,
            name: true,
            specialization: true,
            experience: true,
            avatar: true,
        }
    });

    return res.status(200).json(
        new ApiResponse(200, doctors, "Doctors fetched successfully")
    );
});

// ─── Get All Doctors (Admin) ──────────────────────────────────────────────────

const getAllDoctorsAdmin = asyncHandler(async (req: Request, res: Response) => {
    const doctors = await prisma.doctor.findMany();

    return res.status(200).json(
        new ApiResponse(200, doctors, "Doctors fetched successfully")
    );
});

// ─── Get Doctor By ID (Public) ────────────────────────────────────────────────


    const getDoctorById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params as {id:string};
    if (!id) {
        throw new ApiError(400, "Invalid doctor ID");
    }

    const doctor = await prisma.doctor.findUnique({
        where: { id },
        select: {
            id: true,
            name: true,
            specialization: true,
            experience: true,
            avatar: true,
            workingDays: true,
            workingHours: true,
        }
    });

    if (!doctor) throw new ApiError(404, "Doctor not found");

    return res.status(200).json(
        new ApiResponse(200, doctor, "Doctor fetched successfully")
    );
});

// ─── Update Doctor (Admin) ────────────────────────────────────────────────────

const updateDoctor = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params as {id:string};
    const { name, specialization, email, phone, experience, available, workingDays, workingHours, avatar } = req.body;

    const doctor = await prisma.doctor.findUnique({ where: { id } });
    if (!doctor) throw new ApiError(404, "Doctor not found");

    // If new avatar is uploaded delete old one from S3
    if (avatar && doctor.avatar && avatar !== doctor.avatar) {
        await deleteFromS3(doctor.avatar);
    }

    const updatedDoctor = await prisma.doctor.update({
        where: { id },
        data: {
            ...(name && { name }),
            ...(specialization && { specialization }),
            ...(email && { email }),
            ...(phone !== undefined && { phone: phone ?? null }),
            ...(experience && { experience: parseInt(experience) }),
            ...(available !== undefined && { available }),
            ...(workingDays && { workingDays }),
            ...(workingHours && { workingHours }),
            ...(avatar && { avatar }),
        }
    });

    return res.status(200).json(
        new ApiResponse(200, updatedDoctor, "Doctor updated successfully")
    );
});

// ─── Delete Doctor (Admin) ────────────────────────────────────────────────────

const deleteDoctor = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params as {id:string};

    const doctor = await prisma.doctor.findUnique({ where: { id } });
    if (!doctor) throw new ApiError(404, "Doctor not found");

    // Delete avatar from S3 if exists
    if (doctor.avatar) {
        await deleteFromS3(doctor.avatar);
    }

    await prisma.doctor.delete({ where: { id } });

    return res.status(200).json(
        new ApiResponse(200, {}, "Doctor deleted successfully")
    );
});

// ─── Exports ──────────────────────────────────────────────────────────────────

export {
    getUploadUrl,
    createDoctor,
    getAllDoctors,
    getAllDoctorsAdmin,
    getDoctorById,
    updateDoctor,
    deleteDoctor
};