import { readFileSync } from "fs";
import path from "path";

export function loadHtmlTemplate(name: string): string {
  const filePath = path.join(process.cwd(), "templates", `${name}.html`);
  return readFileSync(filePath, "utf8");
}
