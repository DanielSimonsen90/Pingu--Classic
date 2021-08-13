"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const database_1 = require("../database");
discord_js_1.Guild.prototype.owner = function () {
    return this.members.cache.get(this.ownerId);
};
discord_js_1.Guild.prototype.pGuild = function () {
    return this.client.pGuilds.get(this);
};
discord_js_1.Guild.prototype.member = function (user) {
    return this.members.cache.get(user.id);
};
discord_js_1.Guild.prototype.pGuildMembers = function () {
    return this.client.pGuildMembers.get(this);
};
discord_js_1.Guild.prototype.welcomeChannel = function () {
    const pGuild = this.pGuild();
    const pWelcomeChannel = pGuild.settings.welcomeChannel;
    if (pWelcomeChannel)
        return this.channels.cache.get(pWelcomeChannel._id);
    const welcomeChannel = (this.channels.cache.find(c => c.isText() && ['welcome', 'door', '🚪'].includes(c.name)) ||
        this.systemChannel ||
        this.channels.cache.find(c => c.isText() && c.name == 'general'));
    pGuild.settings.welcomeChannel = new database_1.PChannel(welcomeChannel);
    if (welcomeChannel)
        this.client.pGuilds.update(pGuild, module.exports.name, `Added welcome channel to **${this}**'s Pingu Guild.`);
    return welcomeChannel;
};
