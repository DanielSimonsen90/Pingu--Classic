import { Guild, GuildEmoji, Collection } from "discord.js";
import PinguClientShell from "../client/PinguClientShell";
export declare class EmojiCollection {
    constructor(client: PinguClientShell);
    private _cached;
    private _client;
    get(name: string, limit?: number): GuildEmoji[];
    guild(guild: Guild): Collection<string, GuildEmoji>;
    refresh(client?: PinguClientShell): this;
}
export default EmojiCollection;
