export class TemplateEngine {
  constructor(private escape: boolean = false) {}

  compile(template: string, vars: Record<string, any>): string {
    return template.replace(/{{(.*?)}}/g, (_, key) => {
      const path = key.trim();
      const value = this.resolvePath(vars, path);
      const str = value == null ? "" : String(value);
      return this.escape ? this.escapeHtml(str) : str;
    });
  }

  private resolvePath(obj: any, path: string): any {
    return path.split(".").reduce((acc, k) => acc?.[k], obj);
  }

  private escapeHtml(text: string) {
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }
}
