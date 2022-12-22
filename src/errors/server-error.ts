export class ServerError extends Error {
  constructor(message?: string) {
    super(
      message ??
        'An unhandled error has occurred while performing requested operation.',
    );
    Object.setPrototypeOf(this, ServerError.prototype);
  }
}
