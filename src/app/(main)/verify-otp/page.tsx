'use client'

import OTPVerificationForm from "@/components/forms/otp-verification-form";
import { withGuest } from "@/hoc/withGuest";

function VerifyOTPPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
            <div className="w-full max-w-[400px]">
                <div className="w-full space-y-8 light">
                    <div className="flex justify-center">
                        <h1 className="">KnowAI</h1>
                    </div>
                    <OTPVerificationForm />
                    <p className="text-xs text-muted-foreground text-center">
                        By continuing, you agree to our Terms & Privacy Policy.
                    </p>
                </div>
            </div>
        </div>
    )
}
export default withGuest(VerifyOTPPage);