import { Injectable, PipeTransform } from '@nestjs/common';
import { TransformOptionsType } from '../types';
import { FindOneEntityPipe } from './find-one-entity.pipe';
import { FindManyEntityPipe } from './find-many-entity.pipe';

@Injectable()
export class TransformEntityPipe<T extends object>
  implements
    PipeTransform<TransformOptionsType<T>, Promise<T | T[] | undefined>> {
  constructor(
    private readonly findOneEntityPipe: FindOneEntityPipe<T>,
    private readonly findManyEntityPipe: FindManyEntityPipe<T>,
  ) {}

  async transform({
    data,
    entity,
    fail,
  }: TransformOptionsType<T>): Promise<T | T[] | undefined> {
    if (Array.isArray(data)) {
      return this.findManyEntityPipe.transform({
        ids: data.map(String),
        entity,
        fail: !!fail,
      });
    }

    return this.findOneEntityPipe.transform({
      id: String(data),
      entity,
      fail: !!fail,
    });
  }
}
