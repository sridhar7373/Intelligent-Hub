import { mailer } from "../mailer";
import { TemplateEngine } from "./template-engine";
import { loadHtmlTemplate } from "./template-loader";
import { NotificationContext, TemplateDefinition } from "./type";

export class NotificationManager {
    private static templateEngine = new TemplateEngine();
    private static templates = new Map<string, TemplateDefinition>();

    /** Register built-in templates (runs once on first import) */
    static {
        this.registerTemplate({
            id: "welcome",
            subject: "Welcome {{user.firstName}}!",
            body: loadHtmlTemplate("welcome"),
        });

        this.registerTemplate({
            id: "otp",
            subject: "Your {{appName}} OTP Code",
            body: loadHtmlTemplate("otp"),
        });
    }

    /** Register a template */
    static registerTemplate(template: TemplateDefinition) {
        this.templates.set(template.id, template);
    }

    /** Get template by id */
    static getTemplate(id: string): TemplateDefinition {
        const tpl = this.templates.get(id);
        if (!tpl) throw new Error(`Template '${id}' not found.`);
        return tpl;
    }

    /** Compile + send email */
    static async sendNotification(templateName: string,context: NotificationContext
    ): Promise<void> {
        try {
            const template = this.getTemplate(templateName);

            const compiledSubject = template.subject
                ? this.templateEngine.compile(template.subject, context)
                : "Notification";

            const html = this.templateEngine.compile(template.body, context);

            await mailer.send({
                to: { email: context.email, name: context.userName },
                subject: compiledSubject,
                html,
            });
        }
        catch (error: any) {
            throw new Error(
                `Failed to send notification ${error.message}`
            );
        }
    }
}
