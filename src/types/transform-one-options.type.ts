import { Class } from 'utility-types';

export type TransformOneOptionsType<T extends object> = {
  entity: Class<T>;
  id: string;
  fail: boolean;
};
