import { Collection, Message, MessageEmbed } from "discord.js";
export declare class PinguCacheManager {
    constructor();
    errors: Collection<number, Message[]>;
    events: MessageEmbed[];
    clear(): this;
}
export default PinguCacheManager;
