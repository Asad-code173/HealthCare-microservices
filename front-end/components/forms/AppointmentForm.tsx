"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { SelectItem } from "@/components/ui/select";
import { Doctors } from "@/constants";

import "react-datepicker/dist/react-datepicker.css";

import CustomFormField, { FormFieldType } from "../CustomFormField";
import SubmitButton from "../SubmitButton";
import { Form } from "../ui/form";

// ─────────────────────────────────────────────────────────────
// FIX: Replaced getAppointmentSchema(type) — which returned a
// UNION of 3 Zod schemas — with one flat unified schema.
//
// ROOT CAUSE: When useForm<z.infer<UnionSchema>> is used,
// TypeScript cannot resolve Control<T> to a single concrete type
// because T is a union. This breaks every prop that expects
// Control<FieldValues> in CustomFormField, and also breaks the
// zodResolver generic. No cast can cleanly fix this — the union
// itself must be eliminated.
//
// SOLUTION: One schema, all fields present, conditional fields
// marked optional. Runtime field-level validation is handled
// manually in onSubmit via form.setError(). This gives
// form.control a single concrete type, making all CustomFormField
// usages fully type-safe with zero `as any` casts.
// ─────────────────────────────────────────────────────────────

type Status = "pending" | "scheduled" | "cancelled";

type Appointment = {
  $id?: string;
  primaryPhysician: string;
  schedule: Date | string;
  reason?: string;
  note?: string;
  cancellationReason?: string;
  status?: Status;
};

// Single unified schema — replaces the union from getAppointmentSchema
const AppointmentFormValidation = z.object({
  primaryPhysician: z.string().min(1, "Please select a doctor"),
  schedule: z.coerce.date(),
  reason: z.string().optional(),
  note: z.string().optional(),
  cancellationReason: z.string().optional(),
});

type AppointmentFormValues = z.infer<typeof AppointmentFormValidation>;

export const AppointmentForm = ({
  userId,
  patientId,
  type = "create",
  appointment,
  setOpen,
}: {
  userId: string;
  patientId: string;
  type: "create" | "schedule" | "cancel";
  appointment?: Appointment;
  setOpen?: Dispatch<SetStateAction<boolean>>;
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // form.control is now Control<AppointmentFormValues> — one concrete type
  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(AppointmentFormValidation),
    defaultValues: {
      primaryPhysician: appointment?.primaryPhysician ?? "",
      schedule: appointment ? new Date(appointment.schedule) : new Date(),
      reason: appointment?.reason ?? "",
      note: appointment?.note ?? "",
      cancellationReason: appointment?.cancellationReason ?? "",
    },
  });

  const onSubmit = async (values: AppointmentFormValues) => {
    setIsLoading(true);

    // Runtime conditional validation — replaces what the union schema enforced
    if (type === "cancel" && !values.cancellationReason?.trim()) {
      form.setError("cancellationReason", {
        message: "Cancellation reason is required",
      });
      setIsLoading(false);
      return;
    }

    if (type !== "cancel" && !values.reason?.trim()) {
      form.setError("reason", {
        message: "Appointment reason is required",
      });
      setIsLoading(false);
      return;
    }

    let status: Status;
    switch (type) {
      case "schedule":
        status = "scheduled";
        break;
      case "cancel":
        status = "cancelled";
        break;
      default:
        status = "pending";
    }

    try {
      if (type === "create" && patientId) {
        const payload = {
          userId,
          patient: patientId,
          primaryPhysician: values.primaryPhysician,
          schedule: new Date(values.schedule),
          reason: values.reason,
          status,
          note: values.note,
        };

        console.log("Create appointment payload:", payload);
        // Replace with your API call:
        // const res = await fetch("/api/appointments", { method: "POST", body: JSON.stringify(payload) });
        // const newAppointment = await res.json();
        // router.push(`/patients/${userId}/new-appointment/success?appointmentId=${newAppointment.id}`);

        form.reset();
      } else {
        const payload = {
          userId,
          appointmentId: appointment?.$id,
          primaryPhysician: values.primaryPhysician,
          schedule: new Date(values.schedule),
          status,
          cancellationReason: values.cancellationReason,
          type,
        };

        console.log("Update appointment payload:", payload);
        // Replace with your API call:
        // await fetch(`/api/appointments/${appointment?.$id}`, { method: "PATCH", body: JSON.stringify(payload) });

        setOpen?.(false);
        form.reset();
      }
    } catch (error) {
      console.error(error);
    }

    setIsLoading(false);
  };

  let buttonLabel: string;
  switch (type) {
    case "cancel":
      buttonLabel = "Cancel Appointment";
      break;
    case "schedule":
      buttonLabel = "Schedule Appointment";
      break;
    default:
      buttonLabel = "Submit Appointment";
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 space-y-6">
        {type === "create" && (
          <section className="mb-12 space-y-4">
            <h1 className="header">New Appointment</h1>
            <p className="text-dark-700">
              Request a new appointment in 10 seconds.
            </p>
          </section>
        )}

        {type !== "cancel" && (
          <>
            {/* No `as any` needed — form.control is fully typed */}
            <CustomFormField
              fieldType={FormFieldType.SELECT}
              control={form.control}
              name="primaryPhysician"
              label="Doctor"
              placeholder="Select a doctor"
            >
              {Doctors.map((doctor, i) => (
                <SelectItem key={doctor.name + i} value={doctor.name}>
                  <div className="flex cursor-pointer items-center gap-2">
                    <Image
                      src={doctor.image}
                      width={32}
                      height={32}
                      alt="doctor"
                      className="rounded-full border border-dark-500"
                    />
                    <p>{doctor.name}</p>
                  </div>
                </SelectItem>
              ))}
            </CustomFormField>

            <CustomFormField
              fieldType={FormFieldType.DATE_PICKER}
              control={form.control}
              name="schedule"
              label="Expected appointment date"
              showTimeSelect
              dateFormat="MM/dd/yyyy  -  h:mm aa"
            />

            <div
              className={`flex flex-col gap-6 ${type === "create" && "xl:flex-row"}`}
            >
              <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="reason"
                label="Appointment reason"
                placeholder="Annual monthly check-up"
                disabled={type === "schedule"}
              />

              <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="note"
                label="Comments/notes"
                placeholder="Prefer afternoon appointments, if possible"
                disabled={type === "schedule"}
              />
            </div>
          </>
        )}

        {type === "cancel" && (
          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="cancellationReason"
            label="Reason for cancellation"
            placeholder="Urgent meeting came up"
          />
        )}

        <SubmitButton
          isLoading={isLoading}
          className={`${type === "cancel" ? "shad-danger-btn" : "shad-primary-btn"} w-full`}
        >
          {buttonLabel}
        </SubmitButton>
      </form>
    </Form>
  );
};