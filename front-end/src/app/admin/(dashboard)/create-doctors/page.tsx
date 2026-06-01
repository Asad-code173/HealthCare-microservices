"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Control } from "react-hook-form";
import { z } from "zod";
import { FileUploader } from "@/components/FileUploader";
import { SelectItem } from "@/components/ui/select";

import { Form, FormField, FormItem, FormLabel, FormMessage, FormControl } from "@/components/ui/form";
import { CreateDoctorSchema } from "@/lib/validation";
import CustomFormField, { FormFieldType } from "@/components/CustomFormField";
import SubmitButton from "@/components/SubmitButton";

type FormValues = z.infer<typeof CreateDoctorSchema>;

const SPECIALIZATIONS = [
    "Cardiologist", "Neurologist", "Pediatrician", "Orthopedic Surgeon",
    "Dermatologist", "General Physician", "Psychiatrist", "Oncologist",
    "Radiologist", "Gynecologist",
];

export default function CreateDoctorPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [avatarFile, setAvatarFile] = useState<File[]>([]);

    const router = useRouter();


    const form = useForm<FormValues>({
        resolver: zodResolver(CreateDoctorSchema),
        defaultValues: {
            name: "",
            email: "",
            phone: "",
            specialization: "",
            experience: "",
            available: true,
            workingDays: [],
            workingHoursStart: "",
            workingHoursEnd: "",
        },
    });

    const typedControl = form.control as unknown as Control<any, any>;

    const onSubmit = async (values: FormValues) => {

        setIsLoading(true);
        try {
            let avatarUrl = null;

            if (avatarFile.length > 0) {


                const urlRes = await fetch("/api/store/doctors/upload-url", {
                    method: "POST",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ fileType: avatarFile[0].type }),
                });


                const urlData = await urlRes.json();



                const { presignedUrl, avatarUrl: s3Url } = urlData.data.data;

                const s3Res = await fetch(presignedUrl, {
                    method: "PUT",
                    body: avatarFile[0],
                });



                if (!s3Res.ok) {
                    const errorText = await s3Res.text();


                    throw new Error("S3 upload failed");
                }

                avatarUrl = s3Url;

            }

            console.log("Step 3: Creating doctor with data:", {
                ...values,
                avatar: avatarUrl,
                workingHours: {
                    start: values.workingHoursStart,
                    end: values.workingHoursEnd,
                },
            });

            const response = await fetch("/api/store/doctors/create-doctors", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...values,
                    avatar: avatarUrl,
                    workingHours: {
                        start: values.workingHoursStart,
                        end: values.workingHoursEnd,
                    },
                }),
            });


            const data = await response.json();


            if (!response.ok) throw new Error(data.message || "Failed to create doctor");
            router.push("/admin/doctors");

        } catch (error) {
            console.error("Error at:", error);
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <div className="mx-auto max-w-3xl space-y-8 p-6">
            <div className="space-y-1">
                <h1 className="text-24-bold text-[#e2e8f0]">Add New Doctor</h1>
                <p className="text-14-regular text-[#6b7280]">
                    Fill in the details to register a new doctor.
                </p>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit, (errors) => {
                    console.log("❌ FORM VALIDATION ERRORS:", errors);
                })} className="space-y-6">

                    {/* ── Personal Info ── */}
                    <section className="space-y-4 rounded-xl border border-[#1f2937] bg-[#111827] p-5">
                        <h2 className="text-16-semibold text-[#e2e8f0]">Personal Information</h2>

                        <div className="space-y-2">
                            <label className="text-14-medium text-[#e2e8f0]">Doctor Photo</label>
                            <FileUploader files={avatarFile} onChange={setAvatarFile} />
                        </div>

                        <CustomFormField
                            fieldType={FormFieldType.INPUT}
                            control={typedControl}
                            name="name"
                            label="Full Name"
                            placeholder="Dr. John Doe"
                            iconSrc="/assets/icons/user.svg"
                            iconAlt="user"
                        />

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <CustomFormField
                                fieldType={FormFieldType.INPUT}
                                control={typedControl}
                                name="email"
                                label="Email"
                                placeholder="doctor@carepulse.com"
                                iconSrc="/assets/icons/email.svg"
                                iconAlt="email"
                            />

                            <CustomFormField
                                fieldType={FormFieldType.PHONE_INPUT}
                                control={typedControl}
                                name="phone"
                                label="Phone Number"
                                placeholder="+92 300 1234567"
                            />
                        </div>
                    </section>

                    {/* ── Professional Info ── */}
                    <section className="space-y-4 rounded-xl border border-[#1f2937] bg-[#111827] p-5">
                        <h2 className="text-16-semibold text-[#e2e8f0]">Professional Details</h2>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <CustomFormField
                                fieldType={FormFieldType.SELECT}
                                control={typedControl}
                                name="specialization"
                                label="Specialization"
                                placeholder="Select specialization"
                            >
                                {SPECIALIZATIONS?.map((spec) => (
                                    <SelectItem key={spec} value={spec}>
                                        {spec}
                                    </SelectItem>
                                ))}
                            </CustomFormField>

                            <CustomFormField
                                fieldType={FormFieldType.INPUT}
                                control={typedControl}
                                name="experience"
                                label="Years of Experience"
                                placeholder="e.g. 5"
                            />
                        </div>
                        <div className="flex items-center justify-between rounded-lg border border-[#1f2937] bg-[#0d1117] px-4 py-3">
                            <div>
                                <p className="text-14-medium text-[#e2e8f0]">Available for Appointments</p>
                                <p className="text-12-regular text-[#6b7280]">Toggle doctor's availability status</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => form.setValue("available", !form.watch("available"))}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${form.watch("available") ? "bg-green-500" : "bg-[#363a3d]"
                                    }`}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${form.watch("available") ? "translate-x-6" : "translate-x-1"
                                        }`}
                                />
                            </button>
                        </div>


                    </section>

                    {/* ── Schedule ── */}
                    <section className="space-y-4 rounded-xl border border-[#1f2937] bg-[#111827] p-5">
                        <h2 className="text-16-semibold text-[#e2e8f0]">Working Schedule</h2>
                        {/* Working Days */}
                        <div className="space-y-2">
                            <label className="text-14-medium text-[#e2e8f0]">Working Days</label>
                            <div className="flex flex-wrap gap-2">
                                {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => {
                                    const selected = form.watch("workingDays")?.includes(day);
                                    return (
                                        <button
                                            key={day}
                                            type="button"
                                            onClick={() => {
                                                const current = form.getValues("workingDays") || [];
                                                if (current.includes(day)) {
                                                    form.setValue("workingDays", current.filter((d) => d !== day));
                                                } else {
                                                    form.setValue("workingDays", [...current, day]);
                                                }
                                            }}
                                            className={`rounded-full px-4 py-1.5 text-[13px] border transition-colors ${selected
                                                ? "bg-green-500 border-green-500 text-white"
                                                : "border-[#363a3d] text-[#9ca3af] hover:bg-[#1a1d21]"
                                                }`}
                                        >
                                            {day}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <FormField
                                control={typedControl}
                                name="workingHoursStart"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="shad-input-label">Start Time</FormLabel>
                                        <FormControl>
                                            <select
                                                {...field}
                                                className="shad-select-trigger w-full h-11 rounded-md px-3 text-[14px]"
                                            >
                                                {Array.from({ length: 24 }, (_, i) => {
                                                    const h = i.toString().padStart(2, "0");
                                                    const label = i === 0 ? "12:00 AM" : i < 12 ? `${i}:00 AM` : i === 12 ? "12:00 PM" : `${i - 12}:00 PM`;
                                                    return <option key={h} value={`${h}:00`}>{label}</option>;
                                                })}
                                            </select>
                                        </FormControl>
                                        <FormMessage className="shad-error" />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={typedControl}
                                name="workingHoursEnd"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="shad-input-label">End Time</FormLabel>
                                        <FormControl>
                                            <select
                                                {...field}
                                                className="shad-select-trigger w-full h-11 rounded-md px-3 text-[14px]"
                                            >
                                                {Array.from({ length: 24 }, (_, i) => {
                                                    const h = i.toString().padStart(2, "0");
                                                    const label = i === 0 ? "12:00 AM" : i < 12 ? `${i}:00 AM` : i === 12 ? "12:00 PM" : `${i - 12}:00 PM`;
                                                    return <option key={h} value={`${h}:00`}>{label}</option>;
                                                })}
                                            </select>
                                        </FormControl>
                                        <FormMessage className="shad-error" />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </section>

                    <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="rounded-lg border border-[#363a3d] px-5 py-2.5 text-[13px] text-[#9ca3af] transition-colors hover:bg-[#1a1d21]"
                        >
                            Cancel
                        </button>
                        <SubmitButton isLoading={isLoading}>
                            Create Doctor
                        </SubmitButton>
                    </div>

                </form>
            </Form>
        </div>
    );
}