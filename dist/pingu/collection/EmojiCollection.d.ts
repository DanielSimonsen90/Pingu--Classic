import { Guild, GuildEmoji, Collection } from "discord.js";
import PinguClientBase from "../client/PinguClientBase";
export declare class EmojiCollection {
    constructor(client: PinguClientBase<any>);
    private _cached;
    private _client;
    get(name: string, limit?: number): GuildEmoji[];
    guild(guild: Guild): Collection<string, GuildEmoji>;
    refresh(client?: PinguClientBase<any>): this;
}
export default EmojiCollection;
