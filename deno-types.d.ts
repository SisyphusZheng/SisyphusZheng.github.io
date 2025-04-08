// 告诉TypeScript这个项目是Deno环境
/// <reference lib="deno.ns" />

// 解决JSX声明问题
/// <reference types="preact/jsx-runtime" />

// 全局声明事件
declare interface WindowEventMap {
  localeChange: Event;
}

// 为Fresh框架声明类型
declare module "$fresh/server.ts" {
  export interface Handlers {
    GET?: (req: Request, ctx: any) => Response | Promise<Response>;
    POST?: (req: Request, ctx: any) => Response | Promise<Response>;
    PUT?: (req: Request, ctx: any) => Response | Promise<Response>;
    DELETE?: (req: Request, ctx: any) => Response | Promise<Response>;
    PATCH?: (req: Request, ctx: any) => Response | Promise<Response>;
    HEAD?: (req: Request, ctx: any) => Response | Promise<Response>;
    OPTIONS?: (req: Request, ctx: any) => Response | Promise<Response>;
  }

  export interface PageProps<T = any> {
    data: T;
  }
}

// 声明组件接口
declare interface LayoutProps {
  children: preact.ComponentChildren;
  title?: string;
}
