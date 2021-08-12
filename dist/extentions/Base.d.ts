declare module 'discord.js' {
    interface Base {
        doIn<T>(callback: (self?: this) => T | Promise<T>, time: number | string): Promise<T>;
    }
}
export {};
