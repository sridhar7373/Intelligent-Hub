"use client";

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useSendOtp } from "@/hooks/useSendOtp";

// Email validation schema
const formSchema = z.object({
    email: z.string().email("Enter a valid email address."),
});

export default function EmailInputForm() {
    const router = useRouter();
    const { trigger, isMutating } = useSendOtp();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try 
        {
            await trigger(values);
            toast.success("OTP sent!");
            router.push(`/verify-otp?email=${values.email}`);
        } 
        catch (error: any) 
        {
            toast.error(error.message ?? "Failed to send OTP");
        }
    }

    return (
        <div className="space-y-6">
            <div className="text-center space-y-2">
                <h1 className="text-2xl font-semibold text-foreground">
                    Sign in or create account
                </h1>
                <p className="text-sm text-muted-foreground">
                    Enter your email to continue
                </p>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>

                                <FormControl>
                                    <Input
                                        type="email"
                                        placeholder="you@example.com"
                                        disabled={isMutating}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button type="submit" className="w-full" disabled={isMutating}>
                        {isMutating ? "Sending..." : "Login"}
                    </Button>
                    <p className="text-xs text-muted-foreground text-center">
                        We'll send you a 6-digit login code
                    </p>
                </form>
            </Form>
        </div>
    );
}
