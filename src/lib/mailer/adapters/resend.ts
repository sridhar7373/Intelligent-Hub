import { env } from "@/lib/env";
import { MailerAdapter } from "../mailer-adapter";
import { MailPayload } from "../types";
import { Resend } from "resend";

export class ResendAdapter implements MailerAdapter {
    private client: Resend;

    constructor() {
        if (!env.RESEND_API_KEY) {
            throw new Error("RESEND_API_KEY is missing");
        }
        this.client = new Resend(env.RESEND_API_KEY);
    }

    async send(mail: MailPayload): Promise<{ messageId?: string }> {
        const to = Array.isArray(mail.to)
            ? mail.to.map((addr) => addr.email)
            : mail.to.email;

        const from = mail.from?.email || env.EMAIL_FROM;
        if (!from) {
            throw new Error("EMAIL_FROM is missing");
        }

        const response = await this.client.emails.send({
            from,
            to,
            subject: mail.subject,
            html: mail.html!,
            text: mail.text!,
        });

        return {
            messageId: response.data?.id,
        };
    }
}
