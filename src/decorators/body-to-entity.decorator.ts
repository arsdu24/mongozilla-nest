import {Body} from '@nestjs/common';
import {Class} from 'utility-types';
import {DataToTransformOptionsPipe, TransformEntityPipe} from '../pipes';

export function BodyToEntity<T extends object>(
  entity: Class<T>,
  prop?: string,
  fail?: boolean,
): ParameterDecorator {
    return (target, propertyKey, parameterIndex) => {
        const args: (any | undefined)[] = [
            prop,
            new DataToTransformOptionsPipe(entity, !!fail),
            TransformEntityPipe
        ];

        return Body(
            ...args.filter((value: any | undefined): value is any => !!value)
        )(target, propertyKey, parameterIndex)
    }
}
