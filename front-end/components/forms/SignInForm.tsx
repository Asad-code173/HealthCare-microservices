"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm, Control } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { SignInValidation } from "@/lib/validation";
import "react-phone-number-input/style.css";
import CustomFormField, { FormFieldType } from "../CustomFormField";
import SubmitButton from "../SubmitButton";

export const SignInForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof SignInValidation>>({
    resolver: zodResolver(SignInValidation),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const typedControl = form.control as unknown as Control<any, any>;
  const onSubmit = async (
    values: z.infer<typeof SignInValidation>
  ) => {
    setIsLoading(true);

    try {
      const response = await fetch(
        "/api/store/auth/sign-in",
        {
          method: "POST",
          headers: {
            "Content-Type":"application/json",
          },
          body: JSON.stringify(values),
        }
      );
      console.log("The status of reponse is",response)

      const data = await response.json();
      console.log("Data is this  ", data)

      if (!response.ok) {
        throw new Error(
          data.message || "Sign in failed"
        );
      }
      if (data.data.user.role === "ADMIN") {
        router.push("/admin/dashboard");
      } else {
        router.push("/patient/dashboard");
      }

    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 space-y-6">
        <section className="mb-12 space-y-4">
          <h1 className="header">Welcome back 👋</h1>
          <p className="text-dark-700">Sign in to your account.</p>
        </section>

        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={typedControl}
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
          type="password"
        />

        <SubmitButton isLoading={isLoading}>Sign In</SubmitButton>
      </form>
    </Form>
  );
};