"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PinguGuild = void 0;
const json_1 = require("../../database/json");
const PinguGuildSettings_1 = require("./PinguGuildSettings");
const BasePinguClient_1 = require("../client/BasePinguClient");
class PinguGuild extends json_1.PItem {
    constructor(guild, owner) {
        super(guild);
        const client = BasePinguClient_1.ToBasePinguClient(guild.client);
        if (guild.owner)
            this.guildOwner = new json_1.PGuildMember(guild.owner());
        else if (owner)
            this.guildOwner = new json_1.PGuildMember(owner);
        else
            client.log('error', `Owner wasn't set when making Pingu Guild for "${guild.name}".`);
        this.clients = new Array();
        let clientIndex = client.isLive ? 0 : 1;
        if (clientIndex != 0)
            this.clients.push(null);
        this.clients[clientIndex] = new json_1.PClient(client, guild);
        this.settings = new PinguGuildSettings_1.default(guild);
        this.members = new Map();
        this.joinedAt = new Date();
    }
    guildOwner;
    clients;
    members;
    settings;
    joinedAt;
}
exports.PinguGuild = PinguGuild;
exports.default = PinguGuild;
