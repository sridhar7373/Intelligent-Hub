export type NotificationContext = Record<string, any>;

export type TemplateDefinition = {
  id: string;
  subject?: string;
  body: string;
};

export type NotificationResult = {
  userId: string;
  templateId: string;
  success: boolean;
  message?: any;
  error?: any;
};

export type PreProcessor = (context: NotificationContext) => Promise<NotificationContext> | NotificationContext;

export type PostProcessor = (result: NotificationResult) => Promise<void> | void;