/// <reference path="../Kernel/electron/packages/advanced-discord-notifications/types.d.ts" />

declare module '@logger' {
  interface Logger extends Console {
    startTimer: () => (message: string) => void;
  }

  export default Logger;
}

declare module '@apis' {
  export function sendNotification({ icon, header, content, onClick, ignoreStatusCheck, }: {
    icon: string;
    header: string;
    content: string;
    onClick?: () => void;
    ignoreStatusCheck?: boolean;
  }): void;
  export function injectCSS(data: string, id: string, customNode?: Element): HTMLStyleElement;
}

declare module '@apis/settings' {
  export function create(module: string): {
    get(group: string, def?: any): any;
    set(group: string, value: any): void;
    use(group: string, def?: any): [any, React.Dispatch<any>];
  };
}

declare module '@patcher' {
  export const _patches: Set<unknown>;
  export function addPatch(unpatch: Function): void;
  export function unpatchAll(): void;
  export function after(module: object, funcString: string, replacement: Function): void | (() => void);
  export function before(module: object, funcString: string, replacement: Function): void | (() => void);
  export function instead(module: object, funcString: string, replacement: Function): void | (() => void);
}
