import { Collection } from "discord.js";

declare module 'discord.js' {
    interface Collection<K, V> {
        array(): Array<V>
        keyArray(): Array<K>
    }
}

Collection.prototype.array = function<K, V>(this: Collection<K, V>) {
    return [...this.values()];
}
Collection.prototype.keyArray = function<K, V>(this: Collection<K, V>) {
    return [...this.keys()];
}