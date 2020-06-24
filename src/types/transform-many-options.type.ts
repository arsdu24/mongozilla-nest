import { Class } from 'utility-types';

export type TransformManyOptionsType<T extends object> = {
  entity: Class<T>;
  ids: string[];
  fail: boolean;
};
