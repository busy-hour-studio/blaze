export type BlazeErrorOption =
  | string
  | {
      errors: Record<string, unknown> | unknown | null;
      status: number;
      message: string;
    };
