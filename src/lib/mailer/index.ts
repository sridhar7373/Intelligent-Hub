import { env } from "../env";
import { ResendAdapter } from "./adapters/resend";
import { MailerAdapter } from "./mailer-adapter";
import { MailPayload } from "./types";


class Mailer
{
    adapter: MailerAdapter;
    adopterMap: Record<string, MailerAdapter> = {
        smtp: new ResendAdapter(),
        resend: new ResendAdapter(),
    };

    constructor(provider: "smtp" | "resend")
    {
        this.adapter = this.adopterMap[provider]
    }

    async send(mail: MailPayload)
    {
        try
        {
            const res = await this.adapter.send(mail);
            return res;
        }
        catch (error)
        {
            console.error("Error sending email:", error);
            throw error;
        }
    }
}

export const mailer = new Mailer(env.MAIL_PROVIDER);