import {Query} from '@nestjs/common';
import {Class} from 'utility-types';
import {DataToTransformOptionsPipe, TransformEntityPipe} from '../pipes';

export function QueryToEntity<T extends object>(
  entity: Class<T>,
  query: string,
  fail?: boolean,
): ParameterDecorator {
    return (target, propertyKey, parameterIndex) => {
        const metaDataKey: string = "design:paramtypes";
        const types: Function[] = Reflect.getMetadata(metaDataKey, target, propertyKey);

        types[parameterIndex] = String;

        Reflect.defineMetadata(metaDataKey, types, target, propertyKey);

        return Query(
            query,
            new DataToTransformOptionsPipe(entity, !!fail),
            TransformEntityPipe
        )(target, propertyKey, parameterIndex)
    }
}