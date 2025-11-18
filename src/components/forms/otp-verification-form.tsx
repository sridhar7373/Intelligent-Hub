"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";

import OTPInput from "@/components/ui/otp-input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useSendOtp } from "@/hooks/useSendOtp"; // ⬅ your SWR mutation
import Link from "next/link";
import { useVerifyOtp } from "@/hooks/useVerifyOtp";

// Validation schema
const otpSchema = z.object({
    otp: z.string().length(6, "OTP must be 6 digits"),
});

export default function OTPVerificationForm() {
    const router = useRouter();
    const params = useSearchParams();
    const email = params.get("email") ?? "unknown@example.com";

    const form = useForm<z.infer<typeof otpSchema>>({
        resolver: zodResolver(otpSchema),
        defaultValues: { otp: "" },
    });

    const [timer, setTimer] = useState(30);
    const { trigger: resendOtp, isMutating: isResending } = useSendOtp();
    const { trigger: verifyOtp, isMutating: isVerifying } = useVerifyOtp();

    useEffect(() => {
        if (timer <= 0) return;

        const interval = setInterval(() => {
            setTimer((t) => t - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [timer]);

    async function onSubmit(values: z.infer<typeof otpSchema>) {
        try {
            await verifyOtp({ email, code: values.otp });
            toast.success("OTP verified!");
            window.location.href = "/onboarding";
        } catch (err: any) {
            toast.error(err.message || "Invalid OTP");
        }
    }

    async function handleResend() {
        try {
            await resendOtp({ email });
            toast.success("OTP resent!");
        } catch (e: any) {
            toast.error(e.message || "Failed to resend OTP");
        }
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="text-center space-y-2">
                <h1 className="text-2xl font-semibold">Check your email</h1>
                <p className="text-sm text-muted-foreground">
                    Enter the 6-digit code sent to <br />
                    <span className="font-medium text-foreground">{email}</span>
                </p>
            </div>

            {/* Form */}
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

                    {/* OTP Input */}
                    <FormField
                        control={form.control}
                        name="otp"
                        render={({ field }) => (
                            <FormItem className="flex flex-col items-center space-y-2">
                                <FormControl>
                                    <OTPInput
                                        length={6}
                                        value={field.value}
                                        onChange={field.onChange}
                                        onBlur={field.onBlur}
                                        name={field.name}
                                        disabled={isVerifying}
                                    />
                                </FormControl>
                                <FormMessage className="text-center" />
                            </FormItem>
                        )}
                    />

                    {/* Verify Button */}
                    <Button type="submit" className="w-full" disabled={isVerifying}>
                        {isVerifying ? "Verifying..." : "Verify Code"}
                    </Button>

                    {/* Resend Section */}
                    <div className="text-center text-sm text-muted-foreground">
                        {timer > 0 ? (
                            <p>
                                Didn't receive the code? Try again in{' '}
                                <span className="font-medium text-foreground">{timer}s</span>
                            </p>
                        ) : (
                            <Button
                                variant="link"
                                className="p-0 font-medium"
                                disabled={isResending}
                                onClick={handleResend}
                            >
                                {isResending ? "Resending..." : "Resend Code"}
                            </Button>
                        )}
                    </div>
                    <div className="text-center">
                        <Link href="login" className="text-sm text-primary hover:text-primary/80 w-full transition-colors font-medium">Use a different email</Link>
                    </div>
                </form>
            </Form>
        </div>
    );
}
