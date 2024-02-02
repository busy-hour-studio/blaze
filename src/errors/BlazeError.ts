type RequestErrorOption =
  | string
  | {
      errors: Record<string, unknown> | unknown | null;
      status: number;
      message: string;
    };

export class BlazeError extends Error {
  public status: number;
  public errors: Record<string, unknown> | unknown | null;

  constructor(err: RequestErrorOption) {
    if (typeof err === 'string') {
      super(err);
      this.status = 500;
    } else {
      super(err.message);

      this.status = err.status;
      this.errors = err.errors;
    }

    this.name = 'BlazeError';
  }
}
