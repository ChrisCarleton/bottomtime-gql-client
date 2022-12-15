export class CompoundError extends Error {
  constructor(private readonly errors: Error[]) {
    super();
  }
}
