import type { z } from 'zod';
import type { Random, RecordUnknown } from './helper';

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
