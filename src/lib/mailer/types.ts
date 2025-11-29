export type MailAddress = {
  name?: string;
  email: string;
};

export type MailPayload = {
  to: MailAddress | MailAddress[];
  from?: MailAddress;
  subject: string;
  html?: string;
  text?: string;
};