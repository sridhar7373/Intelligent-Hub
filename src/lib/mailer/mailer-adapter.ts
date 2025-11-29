import { MailPayload } from "./types";

export interface MailerAdapter {
  send(mail: MailPayload): Promise<{ messageId?: string }>;
}