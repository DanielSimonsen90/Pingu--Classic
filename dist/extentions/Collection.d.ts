declare module 'discord.js' {
    interface Collection<K, V> {
        array(): Array<V>;
        keyArray(): Array<K>;
        findByDisplayName(name: string): V;
    }
}
export {};