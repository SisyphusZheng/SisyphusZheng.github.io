/// <reference types="https://deno.land/x/fresh@1.7.3/runtime.ts" />
/// <reference types="https://esm.sh/preact@10.19.6" />
/// <reference types="https://esm.sh/preact@10.19.6/jsx-runtime" />

// 全局标准类型定义
interface Record<K extends keyof any, T> {
  [P in K]: T;
}

type Partial<T> = {
  [P in keyof T]?: T[P];
};

interface Promise<T> {
  then<TResult1 = T, TResult2 = never>(
    onfulfilled?:
      | ((value: T) => TResult1 | Promise<TResult1>)
      | undefined
      | null,
    onrejected?:
      | ((reason: any) => TResult2 | Promise<TResult2>)
      | undefined
      | null
  ): Promise<TResult1 | TResult2>;
  catch<TResult = never>(
    onrejected?:
      | ((reason: any) => TResult | Promise<TResult>)
      | undefined
      | null
  ): Promise<T | TResult>;
  finally(onfinally?: (() => void) | undefined | null): Promise<T>;
}

interface JSON {
  parse(text: string, reviver?: (key: any, value: any) => any): any;
  stringify(
    value: any,
    replacer?: (key: string, value: any) => any | (string | number)[] | null,
    space?: string | number
  ): string;
}

declare var JSON: JSON;

declare module "preact" {
  export interface ComponentChildren {}
  export function h(type: any, props: any, ...children: any[]): any;
}

declare module "$fresh/runtime" {
  export interface HeadProps {
    children?: preact.ComponentChildren;
  }
  export function Head(props: HeadProps): preact.ComponentChildren;
}

declare module "$fresh/server" {
  export interface Handlers<T = any> {
    GET?(req: Request, ctx: any): Promise<Response>;
    POST?(req: Request, ctx: any): Promise<Response>;
    PUT?(req: Request, ctx: any): Promise<Response>;
    DELETE?(req: Request, ctx: any): Promise<Response>;
  }
}

// 应用和插件类型定义
declare interface App {
  use(plugin: Plugin): void;
}

declare interface Plugin {
  install(app: App): void;
  activate(): Promise<void>;
  deactivate(): void;
  configure(config: any): void;
  severity?: string;
}

// i18n插件类型定义
declare interface I18nConfig {
  locales: string[];
  defaultLocale: string;
  fallbackLocale: string;
  debug?: boolean;
  apiEndpoint?: string;
  translationsDir?: string;
}

declare interface TranslationEntry {
  [key: string]: string | TranslationEntry;
}

declare interface I18nPlugin extends Plugin {
  setLocale(locale: string): void;
  getLocale(): string;
  getLocales(): string[];
  getTranslations(): Record<string, TranslationEntry>;
  translate(key: string, params?: Record<string, any>, locale?: string): string;
  waitForTranslations(): Promise<void>;
  initialized: boolean;
}

// Deno API 类型声明
declare namespace Deno {
  export interface CreateOptions {
    recursive?: boolean;
  }

  export interface StatResponse {
    isFile: boolean;
    isDirectory: boolean;
    isSymlink: boolean;
    size: number;
    mtime: Date | null;
    atime: Date | null;
    birthtime: Date | null;
    dev: number;
    ino: number | null;
    mode: number;
    nlink: number;
    uid: number;
    gid: number;
    blksize: number;
    blocks: number;
  }

  export class DenoError extends Error {
    constructor(message?: string);
  }

  export namespace errors {
    export class NotFound extends DenoError {}
    export class PermissionDenied extends DenoError {}
    export class ConnectionRefused extends DenoError {}
    export class ConnectionReset extends DenoError {}
    export class ConnectionAborted extends DenoError {}
    export class NotConnected extends DenoError {}
    export class AddrInUse extends DenoError {}
    export class AddrNotAvailable extends DenoError {}
    export class BrokenPipe extends DenoError {}
    export class AlreadyExists extends DenoError {}
    export class InvalidData extends DenoError {}
    export class TimedOut extends DenoError {}
    export class Interrupted extends DenoError {}
    export class WriteZero extends DenoError {}
    export class UnexpectedEof extends DenoError {}
    export class BadResource extends DenoError {}
    export class Busy extends DenoError {}
  }

  export function mkdir(path: string, options?: CreateOptions): Promise<void>;
  export function stat(path: string): Promise<StatResponse>;
  export function readTextFile(path: string): Promise<string>;
  export function writeTextFile(path: string, data: string): Promise<void>;
  export function remove(
    path: string,
    options?: { recursive?: boolean }
  ): Promise<void>;
  export function cwd(): string;
}

// 添加@preact/signals类型声明
declare module "@preact/signals" {
  export interface Signal<T> {
    value: T;
    peek(): T;
    subscribe(fn: (value: T) => void): () => void;
  }

  export function signal<T>(initialValue: T): Signal<T>;
  export function computed<T>(fn: () => T): Signal<T>;
  export function effect(fn: () => void | (() => void)): () => void;
  export function batch<T>(fn: () => T): T;
}

// 添加博客相关类型
declare interface BlogPost {
  id: string;
  title: string;
  content?: string;
  description?: string;
  cover?: string;
  date?: string | Date;
  author?: string;
  tags?: string[];
  readingTime?: number;
}

// 添加区域和内容类型
declare type Locale = string;

interface LayoutProps {
  children: preact.ComponentChildren;
}
