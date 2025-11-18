export class HttpException extends Error {
  public status: number;
  public message: string;
  public code?: string;
  public details?: any;

  constructor(message: string, status: number, code?: string, details?: any) {
    super(message);
    this.status = status;
    this.message = message;
    this.code = code;
    this.details = details;
    Object.setPrototypeOf(this, HttpException.prototype);
  }
}
