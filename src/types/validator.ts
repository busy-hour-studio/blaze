import { Context as HonoCtx } from 'hono';
import { ZodSchema } from 'zod';
import { Random, RecordString, RecordUnknown } from './common';
import { BlazeValidationErrorHandler } from './handler';

export interface BlazeContextData<
  H extends RecordString = RecordString,
  P extends RecordUnknown = RecordUnknown,
  Q extends RecordUnknown = RecordUnknown,
  B extends RecordUnknown = RecordUnknown,
> {
  headers: H | null;
  params: P | null;
  query: Q | null;
  body: B | null;
}

export interface BlazeContextValidation<
  H extends ZodSchema = ZodSchema,
  P extends ZodSchema = ZodSchema,
  Q extends ZodSchema = ZodSchema,
  B extends ZodSchema = ZodSchema,
> {
  header?: H | null;
  params?: P | null;
  query?: Q | null;
  body?: B | null;
}

export interface BlazeActionValidator<
  H extends ZodSchema = ZodSchema,
  P extends ZodSchema = ZodSchema,
  Q extends ZodSchema = ZodSchema,
  B extends ZodSchema = ZodSchema,
> {
  header?: H | null;
  params?: P | null;
  query?: Q | null;
  body?: B | null;
}

export type AnyBlazeActionValidator = BlazeActionValidator<
  Random,
  Random,
  Random,
  Random
>;

export interface DataValidatorOption<
  M extends RecordUnknown = RecordUnknown,
  H extends RecordString = RecordString,
  P extends RecordUnknown = RecordUnknown,
  Q extends RecordUnknown = RecordUnknown,
  B extends RecordUnknown = RecordUnknown,
> {
  data: BlazeContextData<H, P, Q, B>;
  schema: ZodSchema;
  honoCtx: HonoCtx | null;
  onValidationError: BlazeValidationErrorHandler<M, H, P, Q, B> | null;
}

type ExampleValue<T> = T extends Date ? string : T;

export type ZodOpenAPIMetadata<T = Random, E = ExampleValue<T>> = Omit<
  RecordUnknown,
  'example' | 'examples' | 'default'
> & {
  param?: RecordUnknown & {
    example?: E;
  };
  example?: E;
  examples?: E[];
  default?: T;
};

interface ZodOpenApiFullMetadata<T = Random> {
  _internal?: RecordUnknown;
  metadata?: ZodOpenAPIMetadata<T>;
}

declare module 'zod' {
  interface ZodTypeDef {
    openapi?: ZodOpenApiFullMetadata;
  }

  interface ZodType<
    Output = Random,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    Def extends ZodTypeDef = ZodTypeDef,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    Input = Output,
  > {
    openapi<T extends z.ZodTypeAny>(
      this: T,
      metadata: Partial<ZodOpenAPIMetadata<z.infer<T>>>
    ): T;
    openapi<T extends z.ZodTypeAny>(
      this: T,
      refId: string,
      metadata?: Partial<ZodOpenAPIMetadata<z.infer<T>>>
    ): T;
  }
}
