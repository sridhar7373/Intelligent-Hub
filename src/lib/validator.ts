import { ZodSchema } from "zod";
import { ValidationException } from "./exceptions";

export class Validator {
    static async validate<T>(schema: ZodSchema<T>, data: any): Promise<T> {
        const parsed = await schema.safeParseAsync(data);

        if (!parsed.success) {
            const errors = parsed.error.issues.map(issue => ({
                path: issue.path.join("."),
                message: issue.message
            }));

            throw new ValidationException(errors);
        }

        return parsed.data;
    }
}