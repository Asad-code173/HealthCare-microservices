import Image from "next/image";
import Link from "next/link";

import { SignInForm } from "@/components/forms/SignInForm";

const Signin = () => {
    return (
        <div className="flex h-screen max-h-screen">
            <section className="remove-scrollbar container my-auto">
                <div className="sub-container max-w-[496px]">
                    <Image
                        src="/assets/icons/logo-full.svg"
                        height={1000}
                        width={1000}
                        alt="patient"
                        className="mb-12 h-10 w-fit"
                    />

                    <SignInForm />

                    <div className="text-14-regular mt-20 flex justify-between">
                        <p className="text-dark-600 xl:text-left">
                            © 2026 CarePluse
                        </p>

                        <Link href="/sign-up" className="text-green-500">
                            Don't have an account? Register
                        </Link>
                    </div>
                </div>
            </section>

            <Image
                src="/assets/images/onboarding-img.png"
                height={1000}
                width={1000}
                alt="patient"
                className="side-img max-w-[50%]"
            />
        </div>
    );
};

export default Signin;