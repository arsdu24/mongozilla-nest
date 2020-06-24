import { Class } from 'utility-types';

export type TransformOptionsType<T extends object> = {
  entity: Class<T>;
  data: string[] | string;
  fail?: boolean;
};
