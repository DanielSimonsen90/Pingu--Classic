"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmojiCollection = void 0;
const discord_js_1 = require("discord.js");
class EmojiCollection {
    constructor(client) {
        this._client = client;
        this._cached = new Array();
    }
    _cached;
    _client;
    /**
     * @param name Name of the emoji (case sensitive)
     * @param limit Limit results. Default: null
     */
    get(name, limit) {
        const matches = this._cached.filter(e => e.name == name);
        const result = matches.slice(0, limit || matches.length).sort((a, b) => {
            const savedServersIncludes = this._client.savedServers.map(g => g.id).includes;
            return savedServersIncludes(a.guild.id) || savedServersIncludes(b.guild.id) ? -1 : 1;
        });
        if (!result.length)
            this._client.log('error', `Unable to get emoji from **${name}**`, null, null, {
                params: { name, limit },
                additional: { result }
            });
        return result;
    }
    /**
     * @param name Name of emoji (case sensitive)
     * @param fromIndex For whatever reason you'd be insane enough to require a specific index, instead of being sure you're getting the right emote... Default: 0
     */
    getOne(name, fromIndex = 0) {
        return this.get(name)[fromIndex] || '😵';
    }
    guild(guild) {
        return this._cached.filter(e => e.guild.id == guild.id).reduce((result, e) => result.set(e.name, e), new discord_js_1.Collection());
    }
    refresh(client) {
        if (client)
            this._client = client;
        this._cached = this._client.guilds.cache.reduce((result, guild) => {
            result.push(...guild.emojis.cache.values());
            return result;
        }, new Array());
        this._client.log('console', `Successfully refreshed entries for **Emotes**.`);
        return this;
    }
}
exports.EmojiCollection = EmojiCollection;
exports.default = EmojiCollection;
