import { HttpException } from "./http-exception";
export * from "./http-exception";

export class BadRequestException extends HttpException {
  constructor(message = "Bad Request", details?: any) {
    super(message, 400, "BAD_REQUEST", details);
  }
}

export class UnauthorizedException extends HttpException {
  constructor(message = "Unauthorized", details?: any) {
    super(message, 401, "UNAUTHORIZED", details);
  }
}

export class ForbiddenException extends HttpException {
  constructor(message = "Forbidden", details?: any) {
    super(message, 403, "FORBIDDEN", details);
  }
}

export class NotFoundException extends HttpException {
  constructor(message = "Not Found", details?: any) {
    super(message, 404, "NOT_FOUND", details);
  }
}

export class ConflictException extends HttpException {
  constructor(message = "Conflict", details?: any) {
    super(message, 409, "CONFLICT", details);
  }
}

export class InternalServerErrorException extends HttpException {
  constructor(message = "Internal Server Error", details?: any) {
    super(message, 500, "INTERNAL_ERROR", details);
  }
}

export class ValidationException extends HttpException {
  constructor(errors: any[]) {
    super("Validation failed", 422, "VALIDATION_ERROR", errors);
  }
}