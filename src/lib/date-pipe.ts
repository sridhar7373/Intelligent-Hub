import { format, parseISO, isValid } from "date-fns";

export function formatDate(value: string | Date, fmt: string = "dd MMM yyyy") {
    const date = value instanceof Date ? value : parseISO(value);

    if (!isValid(date)) return "Invalid date";

    return format(date, fmt);
}
