import { Injectable, PipeTransform } from '@nestjs/common';
import { TransformOneOptionsType } from '../types';
import { getEntityManager } from '@mongozilla/mongozilla';

@Injectable()
export class FindOneEntityPipe<T extends object>
  implements PipeTransform<TransformOneOptionsType<T>, Promise<T | undefined>> {
  transform(options: TransformOneOptionsType<T>): Promise<T | undefined> {
    if (options.fail) {
      return getEntityManager().findByIdOrFail(options.entity, options.id);
    }

    return getEntityManager().findById(options.entity, options.id);
  }
}
