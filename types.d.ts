/// <reference path="../Kernel/electron/packages/advanced-discord-notifications/types.d.ts" />

declare module '@logger' {
  export default console;
}

declare module '@apis' {
  export function sendNotification({ userId, content, channelId, messageId, ignoreChannelCheck, ignoreStatusCheck, }: {
    userId: string;
    content: string;
    channelId: string;
    messageId: string;
    ignoreStatusCheck: boolean;
    ignoreChannelCheck: boolean;
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
  declare namespace Patcher {
    const _patches: Set<unknown>;
    const addPatch: (unpatch: Function) => void;
    const unpatchAll: () => void;
    const after: (module: object, funcString: string, replacement: Function) => void | (() => void);
    const before: (module: object, funcString: string, replacement: Function) => void | (() => void);
    const instead: (module: object, funcString: string, replacement: Function) => void | (() => void);
  }
  export default Patcher;
}
