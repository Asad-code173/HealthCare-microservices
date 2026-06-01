"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useState, useEffect } from "react";
import { z } from "zod";

import { SelectItem } from "@/components/ui/select";
import "react-datepicker/dist/react-datepicker.css";

import CustomFormField, { FormFieldType } from "../CustomFormField";
import SubmitButton from "../SubmitButton";
import { Form } from "../ui/form";
import { Control, useForm } from "react-hook-form";

type Status = "pending" | "scheduled" | "cancelled";

type Doctor = {
  id: string;
  name: string;
  avatar?: string;
  specialization?: string;
};

type Appointment = {
  $id?: string;
  primaryPhysician: string;
  schedule: Date | string;
  reason?: string;

  cancellationReason?: string;
  status?: Status;
};

const AppointmentFormValidation = z.object({
  primaryPhysician: z.string().min(1, "Please select a doctor"),
  schedule: z.date(),
  reason: z.string().optional(),

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
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [doctorsLoading, setDoctorsLoading] = useState(true);


  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await fetch("/api/store/doctors/public/get-doctors", {
          credentials: "include",
        });
        const data = await res.json();

        setDoctors(data.data.data);
      } catch (error) {
        console.error("Failed to fetch doctors:", error);
      } finally {
        setDoctorsLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(AppointmentFormValidation),
    defaultValues: {
      primaryPhysician: appointment?.primaryPhysician ?? "",
      schedule: appointment ? new Date(appointment.schedule) : new Date(),
      reason: appointment?.reason ?? "",
      cancellationReason: appointment?.cancellationReason ?? "",
    },
  });

  const typedControl = form.control as unknown as Control<any, any>;

  const onSubmit = async (values: AppointmentFormValues) => {
    setIsLoading(true);

    if (type === "cancel" && !values.cancellationReason?.trim()) {
      form.setError("cancellationReason", {
        message: "Cancellation reason is required",
      });
      setIsLoading(false);
      return;
    }

    if (type !== "cancel" && !values.reason?.trim()) {
      form.setError("reason", { message: "Appointment reason is required" });
      setIsLoading(false);
      return;
    }

    try {
      if (type === "create" && patientId) {
        const res = await fetch("/api/store/appointments/create-appointment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            doctorName: doctors.find(d => d.id === values.primaryPhysician)?.name || values.primaryPhysician,
            schedule: values.schedule,
            reason: values.reason,
          }),
        });

        const data = await res.json();
        

        if (!res.ok) {
          throw new Error(data.message || "Failed to create appointment");
        }

        form.reset();
        router.push("/patient/dashboard");
      }
    } catch (error: any) {
      console.error("Appointment error:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  let buttonLabel: string;
  switch (type) {
    case "cancel": buttonLabel = "Cancel Appointment"; break;
    case "schedule": buttonLabel = "Schedule Appointment"; break;
    default: buttonLabel = "Submit Appointment";
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 space-y-6">
        {type === "create" && (
          <section className="mb-12 space-y-4">
            <h1 className="header">New Appointment</h1>
            <p className="text-dark-700">Request a new appointment in 10 seconds.</p>
          </section>
        )}

        {type !== "cancel" && (
          <>
            <CustomFormField
              fieldType={FormFieldType.SELECT}
              control={typedControl}
              name="primaryPhysician"
              label="Doctor"
              placeholder={doctorsLoading ? "Loading doctors..." : "Select a doctor"}
            >
              {doctors?.map((doctor) => (
                <SelectItem key={doctor.id} value={doctor.id}>
                  <div className="flex cursor-pointer items-center gap-2">
                    {doctor.avatar ? (
                      <Image
                        src={doctor.avatar}
                        width={32}
                        height={32}
                        alt={doctor.name}
                        className="rounded-full border border-dark-500"
                      />
                    ) : (
                      // Fallback avatar agar image nahi hai
                      <div className="flex size-8 items-center justify-center rounded-full border border-dark-500 bg-dark-400 text-sm font-medium text-white">
                        {doctor.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <p>{doctor.name}</p>
                  </div>
                </SelectItem>
              ))}
            </CustomFormField>

            <CustomFormField
              fieldType={FormFieldType.DATE_PICKER}
              control={typedControl}
              name="schedule"
              label="Expected appointment date"
              showTimeSelect
              dateFormat="MM/dd/yyyy  -  h:mm aa"
            />

            <div className={`flex flex-col gap-6 ${type === "create" && "xl:flex-row"}`}>
              <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                control={typedControl}
                name="reason"
                label="Appointment reason"
                placeholder="Annual monthly check-up"
                disabled={type === "schedule"}
              />
            </div>
          </>
        )}

        {type === "cancel" && (
          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={typedControl}
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