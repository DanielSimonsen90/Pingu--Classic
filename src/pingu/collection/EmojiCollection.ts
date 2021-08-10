import { Guild, GuildEmoji, Collection } from "discord.js";
import BasePinguClient from "../client/BasePinguClient";

export class EmojiCollection {
    constructor(client: BasePinguClient<any>) {
        this._client = client;
        this._cached = new Array<GuildEmoji>();
    }

    private _cached: Array<GuildEmoji>
    private _client: BasePinguClient

    public get(name: string, limit?: number): GuildEmoji[] {
        const result = this._cached
            .filter(e => e.name == name)
            .slice(0, limit).sort((a, b) => {
                const savedServersIncludes = this._client.savedServers.map(g => g.id).includes;
                return savedServersIncludes(a.guild.id) || savedServersIncludes(b.guild.id) ? -1 : 1;
            });

        if (!result.length) this._client.log('error', `Unable to get emoji from **${name}**`, null, null, {
            params: { name, limit },
            additional: { result }
        });
        return result;
    }
    public guild(guild: Guild): Collection<string, GuildEmoji> {
        return this._cached.filter(e => e.guild.id == guild.id).reduce((result, e) => result.set(e.name, e), new Collection<string, GuildEmoji>());
    }
    public refresh(client?: BasePinguClient<any>) {
        if (client) this._client = client;

        this._cached = this._client.guilds.cache.reduce((result, guild) => {
            result.push(...guild.emojis.cache.array())
            return result;
        }, new Array<GuildEmoji>());

        this._client.log('console', `Successfully refreshed entries for **Emotes**.`);
        
        return this;
    }
}

export default EmojiCollection;