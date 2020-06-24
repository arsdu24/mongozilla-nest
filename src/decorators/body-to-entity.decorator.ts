import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Class } from 'utility-types';
import { TransformOptionsType } from '../types';
import { TransformEntityPipe } from '../pipes';

export function BodyToEntity<T extends object>(
  entity: Class<T>,
  prop?: string,
  fail?: boolean,
) {
  return createParamDecorator<
    unknown,
    ExecutionContext,
    TransformOptionsType<T>
  >(
    (_, ctx: ExecutionContext): TransformOptionsType<T> => {
      const request = ctx.switchToHttp().getRequest();
      const data: string | string[] = prop ? request.body[prop] : request.body;

      return { entity, data, fail };
    },
  )(TransformEntityPipe);
}
