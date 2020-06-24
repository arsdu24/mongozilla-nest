import { Injectable, PipeTransform } from '@nestjs/common';
import { TransformManyOptionsType } from '../types';
import { getEntityManager } from '@mongozilla/mongozilla';

@Injectable()
export class FindManyEntityPipe<T extends object>
  implements PipeTransform<TransformManyOptionsType<T>, Promise<T[]>> {
  async transform(options: TransformManyOptionsType<T>): Promise<T[]> {
    if (options.fail) {
      return Promise.all(
        options.ids.map((id) =>
          getEntityManager().findByIdOrFail(options.entity, id),
        ),
      );
    }

    const entities: (T | undefined)[] = await Promise.all(
      options.ids.map((id) => getEntityManager().findById(options.entity, id)),
    );

    return entities.filter((entity: T | undefined): entity is T => !!entity);
  }
}
