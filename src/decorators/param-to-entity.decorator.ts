import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Class } from 'utility-types';
import { TransformOptionsType } from '../types';
import { TransformEntityPipe } from '../pipes';

export function ParamToEntity<T extends object>(
  entity: Class<T>,
  param: string,
  fail?: boolean,
) {
  return createParamDecorator<
    unknown,
    ExecutionContext,
    TransformOptionsType<T>
  >(
    (_, ctx: ExecutionContext): TransformOptionsType<T> => {
      const request = ctx.switchToHttp().getRequest();
      const data: string | string[] = request.param[param];

      return { entity, data, fail };
    },
  )(TransformEntityPipe);
}
