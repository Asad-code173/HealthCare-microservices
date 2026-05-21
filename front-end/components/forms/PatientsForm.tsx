"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

import { z } from "zod";
import { useForm, Control } from "react-hook-form";

import { Form } from "@/components/ui/form";
import { UserFormValidation } from "@/lib/validation";

import "react-phone-number-input/style.css";
import CustomFormField, { FormFieldType } from "../CustomFormField";
import SubmitButton from "../SubmitButton";

export const PatientForm = () => {
    const [isLoading, setIsLoading] = useState(false);


    const form = useForm<z.infer<typeof UserFormValidation>>({
        resolver: zodResolver(UserFormValidation),
        defaultValues: {
            name: "",
            email: "",
            password: "",
        },
    });
    const typedControl = form.control as unknown as Control<any, any>;

    const onSubmit = async (values: z.infer<typeof UserFormValidation>) => {
        setIsLoading(true);
        // Yahan apni Express API call karein
        console.log(values);
        setIsLoading(false);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 space-y-6">
                <section className="mb-12 space-y-4">
                    <h1 className="header">Hi there 👋</h1>
                    <p className="text-dark-700">Get started with appointments.</p>
                </section>

                <CustomFormField
                    fieldType={FormFieldType.INPUT}

                    control={form.control as unknown as Control<any, any>}
                    name="name"
                    label="Full name"
                    placeholder="John Doe"
                    iconSrc="/assets/icons/user.svg"
                    iconAlt="user"
                />

                <CustomFormField
                    fieldType={FormFieldType.INPUT}

                    control={form.control as unknown as Control<any, any>}
                    name="email"
                    label="Email"
                    placeholder="johndoe@gmail.com"
                    iconSrc="/assets/icons/email.svg"
                    iconAlt="email"
                />

                <CustomFormField
                    fieldType={FormFieldType.INPUT}
                    control={typedControl}
                    name="password"
                    label="Password"
                    placeholder="Enter your password"
                />

                <SubmitButton isLoading={isLoading}>Register</SubmitButton>
            </form>
        </Form>
    );
};