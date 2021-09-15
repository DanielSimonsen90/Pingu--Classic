import { Guild, GuildEmoji, Collection } from "discord.js";
import PinguClientBase from "../client/PinguClientBase";
export declare class EmojiCollection {
    constructor(client: PinguClientBase<any>);
    private _cached;
    private _client;
    /**
     * @param name Name of the emoji (case sensitive)
     * @param limit Limit results. Default: null
     */
    get(name: string, limit?: number): GuildEmoji[];
    /**
     * @param name Name of emoji (case sensitive)
     * @param fromIndex For whatever reason you'd be insane enough to require a specific index, instead of being sure you're getting the right emote... Default: 0
     */
    getOne(name: string, fromIndex?: number): GuildEmoji | "😵";
    guild(guild: Guild): Collection<string, GuildEmoji>;
    refresh(client?: PinguClientBase<any>): this;
}
export default EmojiCollection;
