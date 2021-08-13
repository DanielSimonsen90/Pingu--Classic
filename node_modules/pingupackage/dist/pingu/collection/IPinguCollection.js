"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IPinguCollection = void 0;
const discord_js_1 = require("discord.js");
class IPinguCollection {
    constructor(client, logChannelName, itemName, newPT, typeManager) {
        this._client = client;
        this._inner = new discord_js_1.Collection();
        this._itemName = itemName;
        this._logChannelName = logChannelName;
        this._newPT = newPT;
        this._typeManager = typeManager;
    }
    _client;
    _inner;
    _itemName;
    _logChannelName;
    get logChannel() {
        const guild = this._client.guilds.cache.get(this._client.savedServers.get('Pingu Support').id);
        const logChannelCategory = guild.channels.cache.find(c => c.type == 'GUILD_CATEGORY' && c.name.includes('Pingu Logs'));
        return logChannelCategory.children.find(c => c.name.includes(this._logChannelName));
    }
    _newPT;
    _typeManager;
    get(item) {
        return this._inner.get(item.id);
    }
    array() {
        return this._inner.array();
    }
    find(predicate) {
        const entries = this.array();
        for (let i = 0; i < entries.length; i++) {
            const entry = entries[i];
            const item = this._typeManager(this._client, entry).cache.get(entry._id);
            if (predicate(entry, item, i, this))
                return entry;
        }
        return null;
    }
    has(item) {
        return this._inner.has(item.id);
    }
    async log(script, reason, err) {
        const logType = this._itemName == 'PinguUser' ? 'pUser' : 'pGuild';
        return this._client.log(logType, script, err ? reason.errMsg : reason.succMsg, err);
    }
}
exports.IPinguCollection = IPinguCollection;
exports.default = IPinguCollection;
