function filterArray<T extends object>(target: T[], source: T[], key: keyof T): T[] {
  return source.filter((s) => !target.some((t) => t?.[key] === s?.[key]));
}

function isObject(item: unknown): item is Record<string, unknown> {
  return !!item && typeof item === 'object' && !Array.isArray(item);
}

export function deepClone<T>(value: T, visited = new WeakMap()): T {
  if (value === null || typeof value !== 'object') {
    return value;
  }

  if (value instanceof Date) {
    return new Date(value.getTime()) as T;
  }

  if (value instanceof RegExp) {
    return new RegExp(value.source, value.flags) as T;
  }

  if (visited.has(value)) {
    return visited.get(value);
  }

  if (Array.isArray(value)) {
    const arr: unknown[] = [];

    visited.set(value, arr);
    value.forEach((item) => {
      arr.push(deepClone(item, visited));
    });

    return arr as unknown as T;
  }

  if (value instanceof Map) {
    const map = new Map();

    visited.set(value, map);
    value.forEach((v, k) => {
      map.set(deepClone(k, visited), deepClone(v, visited));
    });

    return map as unknown as T;
  }

  if (value instanceof Set) {
    const set = new Set();

    visited.set(value, set);
    value.forEach((v) => {
      set.add(deepClone(v, visited));
    });

    return set as unknown as T;
  }

  const clonedObj: Record<string, unknown> = {};

  visited.set(value, clonedObj);
  Object.keys(value).forEach((key) => {
    clonedObj[key] = deepClone((value as Record<string, unknown>)[key], visited);
  });

  return clonedObj as T;
}

export function deepMerge<T extends object>(
  target: Partial<T>,
  source: Partial<T>,
  arrayFilterBy: Record<string, string> = {},
  seen = new WeakMap<object, object>(),
): T {
  if (!isObject(target) && !isObject(source)) {
    return {} as T;
  }

  if (isObject(target) && !isObject(source)) {
    return target as T;
  }

  if (!isObject(target) && isObject(source)) {
    return source as T;
  }

  if (seen.has(source)) {
    return seen.get(source) as T;
  }

  const output = deepClone(target);

  seen.set(source, output);

  Object.keys(source).forEach((k) => {
    const key = k as keyof Partial<T>;
    const keyInTarget = key in target;
    const sourceValue = source[key];
    const targetValue = target[key];

    if (isObject(sourceValue) && keyInTarget && isObject(targetValue)) {
      const value = deepMerge(targetValue, sourceValue, arrayFilterBy, seen);

      Object.assign(output, { [key]: value });
    } else if (Array.isArray(sourceValue) && keyInTarget && Array.isArray(targetValue)) {
      const filterBy = arrayFilterBy?.[key as string] as keyof Partial<T>;

      if (filterBy) {
        const filteredArray = filterArray<T>(targetValue, sourceValue, filterBy);

        Object.assign(output, { [key]: [...targetValue, ...filteredArray] });
      } else {
        Object.assign(output, { [key]: Array.from(new Set([...targetValue, ...sourceValue])) });
      }
    } else {
      Object.assign(output, { [key]: sourceValue });
    }
  });

  return output as T;
}
