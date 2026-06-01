import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { prisma } from "../../lib/prisma.js";
import { AppointmentStatus } from "@prisma/client";

// Create Booking
export const createBooking = asyncHandler(async (req, res) => {
 
  const { doctorName, schedule, reason } = req.body;
    const patientName = req.user?.username;

  if (!doctorName || !patientName || !schedule || !reason) {
    throw new ApiError(400, "All fields are required");
  }

  const scheduledDate = new Date(schedule);
  if (isNaN(scheduledDate.getTime())) {
    throw new ApiError(400, "Invalid schedule date");
  }

  if (scheduledDate < new Date()) {
    throw new ApiError(400, "Appointment cannot be scheduled in the past");
  }

  const appointment = await prisma.appointment.create({
    data: {
      patientName,
      doctorName,
      schedule: scheduledDate,
      reason,
      status: AppointmentStatus.PENDING,
    },
  });

  return res
    .status(201)
    .json(new ApiResponse(201, appointment, "Appointment booked successfully"));
});

// Fetch Bookings
export const fetchBookings = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  const username = req.user?.username;
  const role = req.user?.role;

  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  const { status } = req.query as { status?: string };

  const validStatuses = ["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"];
  if (status && !validStatuses.includes(status)) {
    throw new ApiError(400, `Invalid status. Must be one of: ${validStatuses.join(", ")}`);
  }

  const whereClause: any = {};

  // Admin sab dekhe, patient sirf apni
  if (role !== "ADMIN") {
    whereClause.patientName = username;
  }

  if (status) whereClause.status = status;

  const appointments = await prisma.appointment.findMany({
    where: whereClause,
    orderBy: { schedule: "asc" },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, appointments, "Appointments fetched successfully"));
});
// Confirm Booking
export const confirmBooking = asyncHandler(async (req, res) => {
  const { appointmentId } = req.params as { appointmentId: string };

  const appointment = await prisma.appointment.findUnique({
    where: { id: appointmentId },
  });

  if (!appointment) {
    throw new ApiError(404, "Appointment not found");
  }

  if (appointment.status !== "PENDING") {
    throw new ApiError(400, `Cannot confirm an appointment with status: ${appointment.status}`);
  }

  const updatedAppointment = await prisma.appointment.update({
    where: { id: appointmentId },
    data: { status: AppointmentStatus.CONFIRMED },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, updatedAppointment, "Appointment confirmed successfully"));
});

// Cancel Booking
export const cancelBooking = asyncHandler(async (req, res) => {
  const { appointmentId } = req.params as { appointmentId: string };

  const appointment = await prisma.appointment.findUnique({
    where: { id: appointmentId },
  });

  if (!appointment) {
    throw new ApiError(404, "Appointment not found");
  }

  if (
    appointment.status === AppointmentStatus.COMPLETED ||
    appointment.status === AppointmentStatus.CANCELLED
  ) {
    throw new ApiError(400, `Appointment is already ${appointment.status.toLowerCase()}`);
  }

  const updatedAppointment = await prisma.appointment.update({
    where: { id: appointmentId },
    data: {
      status: AppointmentStatus.CANCELLED,
      cancellationReason: req.body.cancellationReason || null,
    },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, updatedAppointment, "Appointment cancelled successfully"));
});