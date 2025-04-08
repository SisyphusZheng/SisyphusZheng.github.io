import { JSX as PreactJSX } from "preact";

declare global {
  namespace JSX {
    interface IntrinsicElements extends PreactJSX.IntrinsicElements {}
  }
}

declare module "preact/jsx-runtime" {
  export const jsx: typeof h;
  export const jsxs: typeof h;
  export const Fragment: any;
  export function h(type: any, props: any, ...children: any[]): any;
}

declare module "preact" {
  export function h(type: any, props: any, ...children: any[]): any;
  export const Fragment: any;
  export const createContext: any;
  export const Component: any;
}

declare module "preact/hooks" {
  export function useState<T>(
    initialState: T | (() => T)
  ): [T, (value: T | ((prevState: T) => T)) => void];
  export function useEffect(
    effect: () => void | (() => void),
    deps?: any[]
  ): void;
  export function useRef<T>(initialValue?: T): { current: T };
  export function useContext<T>(context: any): T;
  export function useCallback<T extends (...args: any[]) => any>(
    callback: T,
    deps: any[]
  ): T;
  export function useMemo<T>(factory: () => T, deps: any[]): T;
}
