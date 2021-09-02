import { Guild, GuildEmoji, Collection } from "discord.js";
import BasePinguClient from "../client/BasePinguClient";
export declare class EmojiCollection {
    constructor(client: BasePinguClient<any>);
    private _cached;
    private _client;
    get(name: string, limit?: number): GuildEmoji[];
    guild(guild: Guild): Collection<string, GuildEmoji>;
    refresh(client?: BasePinguClient<any>): this;
}
export default EmojiCollection;
