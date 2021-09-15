import { Guild, GuildEmoji, Collection } from "discord.js";
import PinguClientBase from "../client/PinguClientBase";

export class EmojiCollection {
    constructor(client: PinguClientBase<any>) {
        this._client = client;
        this._cached = new Array<GuildEmoji>();
    }

    private _cached: Array<GuildEmoji>
    private _client: PinguClientBase

    /**
     * @param name Name of the emoji (case sensitive)
     * @param limit Limit results. Default: null
     */
    public get(name: string, limit?: number): GuildEmoji[] {
        const matches = this._cached.filter(e => e.name == name);
        const result = matches.slice(0, limit || matches.length).sort((a, b) => {
            const savedServersIncludes = this._client.savedServers.map(g => g.id).includes;
            return savedServersIncludes(a.guild.id) || savedServersIncludes(b.guild.id) ? -1 : 1;
        });

        if (!result.length) this._client.log('error', `Unable to get emoji from **${name}**`, null, null, {
            params: { name, limit },
            additional: { result }
        });
        return result;
    }
    /**
     * @param name Name of emoji (case sensitive)
     * @param fromIndex For whatever reason you'd be insane enough to require a specific index, instead of being sure you're getting the right emote... Default: 0
     */
    public getOne(name: string, fromIndex = 0) {
        return this.get(name)[fromIndex] || '😵';
    }
    public guild(guild: Guild): Collection<string, GuildEmoji> {
        return this._cached.filter(e => e.guild.id == guild.id).reduce((result, e) => result.set(e.name, e), new Collection<string, GuildEmoji>());
    }
    public refresh(client?: PinguClientBase<any>) {
        if (client) this._client = client;

        this._cached = this._client.guilds.cache.reduce((result, guild) => {
            result.push(...guild.emojis.cache.values())
            return result;
        }, new Array<GuildEmoji>());

        this._client.log('console', `Successfully refreshed entries for **Emotes**.`);
        
        return this;
    }
}

export default EmojiCollection;