"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
    get logChannel() {
        const guild = this._client.guilds.cache.get(this._client.savedServers.get('Pingu Support').id);
        const logChannelCategory = guild.channels.cache.find(c => c.type == 'category' && c.name.includes('Pingu Logs'));
        return logChannelCategory.children.find(c => c.name.includes(this._logChannelName));
    }
    get(item) {
        return this._inner.get(item.id);
    }
    array() {
        return this._inner.array();
    }
    find(predicate) {
        const entries = this._inner.array();
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
    log(script, reason, err) {
        return __awaiter(this, void 0, void 0, function* () {
            const logType = this._itemName == 'PinguUser' ? 'pUser' : 'pGuild';
            return this._client.log(logType, script, err ? reason.errMsg : reason.succMsg, err);
        });
    }
}
exports.IPinguCollection = IPinguCollection;
exports.default = IPinguCollection;
