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
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useCompleteOnboarding } from "@/hooks/useCompleteOnboarding";

// Validation schema
const formSchema = z.object({
    username: z
        .string()
        .trim()
        .min(2, "Username must be at least 2 characters.")
        .max(30, "Username too long"),

    workspaceName: z
        .string()
        .trim()
        .min(2, "Workspace name required")
        .max(40),

    kbName: z
        .string()
        .trim()
        .min(2, "Knowledge base name required")
        .max(40),
});

type OnboardingProps = {
    email?: string
}

export default function OnboardingForm({ email = "unknown@example.com" }: OnboardingProps) {
    const params = useSearchParams();

    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            workspaceName: "",
            kbName: "",
        },
    });

    const { trigger: completeOnboarding, isMutating } = useCompleteOnboarding();

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            const result = await completeOnboarding(values);
            toast.success("Onboarding complete!");
            const kbId = result?.user?.kb?.id;
            router.replace(`/kb/${kbId}`);

        } catch (err: any) {
            toast.error(err.message || "Could not complete onboarding");
        }
    }

    return (
        <div className="space-y-6 max-w-md mx-auto">
            {/* Header */}
            <div className="text-center space-y-2">
                <h1 className="text-2xl font-semibold text-foreground">
                    Complete your profile
                </h1>
                <p className="text-sm text-muted-foreground">
                    Set up your username and workspace
                </p>
            </div>

            {/* Email summary */}
            <div className="bg-muted/50 rounded-lg p-3 text-center">
                <p className="text-xs text-muted-foreground">Signing in as</p>
                <p className="text-sm font-medium text-foreground">{email}</p>
            </div>

            {/* Onboarding Form */}
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                    {/* Username */}
                    <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                    <Input placeholder="your username" {...field} disabled={isMutating} />
                                </FormControl>
                                <FormDescription>
                                    This will be your display name in the workspace.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Workspace Name */}
                    <FormField
                        control={form.control}
                        name="workspaceName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Workspace Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Your workspace" {...field} disabled={isMutating} />
                                </FormControl>
                                <FormDescription>
                                    This is the workspace where your knowledge bases live.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Knowledge Base Name */}
                    <FormField
                        control={form.control}
                        name="kbName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Knowledge Base Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="My Knowledge Base" {...field} disabled={isMutating} />
                                </FormControl>
                                <FormDescription>
                                    A default knowledge base will be created for you.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Submit */}
                    <Button type="submit" className="w-full" disabled={isMutating}>
                        {isMutating ? "Saving..." : "Complete Setup"}
                    </Button>
                </form>
            </Form>
        </div>
    );
}
