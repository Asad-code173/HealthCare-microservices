"use client";

import { AppointmentForm } from "@/components/forms/AppointmentForm";



const STATIC_USER_ID    = "static-user-123";
const STATIC_PATIENT_ID = "static-patient-456";

export default function BookAppointmentPage() {
    return (
        <div className="mx-auto max-w-3xl">          
                <AppointmentForm
                    type="create"
                    userId={STATIC_USER_ID}
                    patientId={STATIC_PATIENT_ID}
                />
            

        </div>
    );
}