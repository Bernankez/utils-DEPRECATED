// refer to https://github.com/youzan/vant/blob/HEAD/packages/vant/src/utils/deep-clone.ts
import { isDefined, isObject } from "@/validate";

export function deepClone<T extends Record<string, any> | null | undefined>(obj: T, deep: boolean = true): T {
  if (!deep) {
    return obj;
  }
  if (!isDefined(obj)) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => deepClone(item)) as unknown as T;
  }

  if (isObject(obj)) {
    const to = {} as Record<string, any>;
    Object.keys(obj).forEach(key => {
      to[key] = deepClone(obj[key]);
    });

    return to as T;
  }

  return obj;
}
