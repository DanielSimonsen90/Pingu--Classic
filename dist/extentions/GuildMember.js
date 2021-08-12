"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
discord_js_1.GuildMember.prototype.pGuildMember = function () {
    return this.client.pGuildMembers.get(this.guild).get(this);
};
