import { MailerAdapter } from "../mailer-adapter";
import { MailAddress, MailPayload } from "../types";

function toAddress(a: MailAddress | MailAddress[] | undefined) {
  if (!a) return undefined;
  if (Array.isArray(a)) return a.map(x => (x.name ? `${x.name} <${x.email}>` : x.email));
  return a.name ? `${a.name} <${a.email}>` : a.email;
}

export class SmtpAdapter implements MailerAdapter
{
    send(mail: MailPayload): Promise<{ messageId?: string; }> {
        throw new Error("Method not implemented.");
    }
    
}