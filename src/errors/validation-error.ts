export interface ValidationErrorDetails {
  readonly path?: string;
  readonly message: string;
}

export class ValidationError extends Error {
  constructor(message?: string, readonly details?: ValidationErrorDetails[]) {
    super(message);
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}
