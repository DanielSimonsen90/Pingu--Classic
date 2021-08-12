"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PClient = void 0;
const discord_js_1 = require("discord.js");
const PinguClient_1 = require("../../pingu/client/PinguClient");
class PClient {
    constructor(client, guild) {
        const pinguClient = PinguClient_1.ToPinguClient(client);
        this._id = client.user.id;
        this.displayName = guild.me.displayName;
        const botRole = guild.me.roles.cache.find(r => r.managed);
        this.embedColor = botRole?.color || discord_js_1.Util.resolveColor(guild.me.displayHexColor) || pinguClient.DefaultEmbedColor;
        this.prefix = pinguClient.DefaultPrefix;
    }
    displayName;
    embedColor;
    prefix;
    _id;
}
exports.PClient = PClient;
exports.default = PClient;
