/**
 * 简单的信号实现
 */
export function signal<T>(initialValue: T) {
  let value = initialValue;
  const subscribers = new Set<(value: T) => void>();

  return {
    get value() {
      return value;
    },
    set value(newValue: T) {
      if (value !== newValue) {
        value = newValue;
        subscribers.forEach((fn) => fn(newValue));
      }
    },
    subscribe(fn: (value: T) => void) {
      subscribers.add(fn);
      return () => {
        subscribers.delete(fn);
      };
    },
  };
}
