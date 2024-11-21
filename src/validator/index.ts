import type { ContextValidator } from '../internal/context/types';
import type { RecordString, RecordUnknown } from '../types/common';
import { isEmpty } from '../utils/common';
import { validationMap } from './constant';
import type { AllDataValidatorOption } from './types';

export async function validateAll<
  M extends RecordUnknown,
  H extends RecordString,
  P extends RecordUnknown,
  Q extends RecordUnknown,
  B extends RecordUnknown,
>(options: AllDataValidatorOption<M, H, P, Q, B>) {
  const { ctx, input, validator, honoCtx, setter } = options;

  if (!validator || isEmpty(validator)) return;

  await Promise.all(
    Object.keys(validator).map((key) => {
      const validation = validationMap[key as keyof ContextValidator];
      const schema = validator[validation.schema];
      const data = input[validation.options];

      if (!validation || !schema) return;

      return validation.validator({
        ctx,
        setter,
        data,
        honoCtx,
        schema,
      });
    })
  );
}
