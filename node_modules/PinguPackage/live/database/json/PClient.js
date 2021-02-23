"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PClient = void 0;
const PinguClient_1 = require("../../pingu/client/PinguClient");
class PClient {
    constructor(client, guild) {
        const pinguClient = PinguClient_1.ToPinguClient(client);
        this._id = client.user.id;
        this.displayName = guild.me.displayName;
        this.embedColor = guild.me.roles.cache.find(role => role.managed).color || pinguClient.DefaultEmbedColor;
        this.prefix = pinguClient.DefaultPrefix;
    }
}
exports.PClient = PClient;
