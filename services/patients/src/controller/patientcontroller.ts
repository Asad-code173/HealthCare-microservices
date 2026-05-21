import type{ Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { prisma } from "../../lib/prisma.js";


const registerPatient = asyncHandler(async (req: Request, res: Response) => {
  const {
    fullName,
    email,
    phone,
    birthDate,
    gender,
    address,
    occupation,
    emergencyContactName,
    emergencyContactNumber,
    primaryPhysician,
    insuranceProvider,
    insurancePolicyNumber,
    allergies,
    currentMedication,
    familyMedicalHistory,
    pastMedicalHistory,
    identificationType,
    identificationNumber,
    identificationDocument,
    privacyConsent,
  } = req.body;

  // Check required fields
  if (
    !fullName ||
    !email ||
    !phone ||
    !birthDate ||
    !gender ||
    !address ||
    !emergencyContactName ||
    !emergencyContactNumber ||
    !primaryPhysician ||
    !identificationType ||
    !identificationNumber ||
    !privacyConsent
  ) {
    throw new ApiError(400, "Please fill all required fields");
  }

  // Check if patient already exists
  const existingPatient = await prisma.patient.findFirst({
    where: { email },
  });

  if (existingPatient) {
    throw new ApiError(409, "Patient with this email already exists");
  }

  // Create patient
  const patient = await prisma.patient.create({
    data: {
      fullName,
      email,
      phone,
      birthDate: new Date(birthDate),
      gender,
      address,
      occupation,
      emergencyContactName,
      emergencyContactNumber,
      primaryPhysician,
      insuranceProvider,
      insurancePolicyNumber,
      allergies,
      currentMedication,
      familyMedicalHistory,
      pastMedicalHistory,
      identificationType,
      identificationNumber,
      identificationDocument,
      privacyConsent,
    },
  });

  return res
    .status(201)
    .json(new ApiResponse(201, patient, "Patient registered successfully"));
});


const getPatients = asyncHandler(async (_req: Request, res: Response) => {
  const [patients, totalPatients] = await Promise.all([
    prisma.patient.findMany({
      orderBy: {
        createdAt: "desc",
      },
    }),

    prisma.patient.count(),
  ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        totalPatients,
        patients,
      },
      "Patients fetched successfully"
    )
  );
});



const updatePatient = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params as {id:string}  ;
  const {
    phone,
    address,
    occupation,
    emergencyContactName,
    emergencyContactNumber,
  } = req.body;

  // Check if patient exists
  const patient = await prisma.patient.findUnique({
    where: { id },
  });

  if (!patient) {
    throw new ApiError(404, "Patient not found");
  }

  const updatedPatient = await prisma.patient.update({
    where: { id },
    data: {
      ...(phone && { phone }),
      ...(address && { address }),
      ...(occupation && { occupation }),
      ...(emergencyContactName && { emergencyContactName }),
      ...(emergencyContactNumber && { emergencyContactNumber }),
    },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, updatedPatient, "Patient updated successfully"));
});


const getPatientById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };

  const patient = await prisma.patient.findUnique({
    where: { id },
  });

  if (!patient) {
    throw new ApiError(404, "Patient not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, patient, "Patient fetched successfully"));
});



export { 
    registerPatient,
    getPatients,
    updatePatient,
    getPatientById
};

