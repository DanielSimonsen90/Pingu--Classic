"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const voice_1 = require("@discordjs/voice");
const ms_1 = require("ms");
const PChannel_1 = require("./database/json/PChannel");
//#region Base
discord_js_1.Base.prototype.doIn = function (callback, time) {
    const timeout = typeof time == 'number' ? time : ms_1.default(time);
    return new Promise((resolve, reject) => {
        try {
            setTimeout(() => {
                resolve(callback(this));
            }, timeout);
        }
        catch (err) {
            reject(err);
        }
    });
};
//#endregion
//#region BaseGuildVoiceChannel
discord_js_1.BaseGuildVoiceChannel.prototype.join = function () {
    if (!this.joinable)
        throw new Error(`Voice channel is not joinable!`);
    return voice_1.joinVoiceChannel({
        channelId: this.id,
        guildId: this.guildId,
        adapterCreator: this.guild.voiceAdapterCreator
    });
};
//#endregion
//#region Collection
discord_js_1.Collection.prototype.array = function () {
    return [...this.values()];
};
discord_js_1.Collection.prototype.keyArray = function () {
    return [...this.keys()];
};
discord_js_1.Collection.prototype.findByDisplayName = function (name) {
    return [
        this.find(v => v.tag == name),
        this.find(v => v.name == name),
        this.find(v => v.displayName == name),
    ].filter(v => v)[0];
};
//#endregion
//#region Guild
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
    pGuild.settings.welcomeChannel = new PChannel_1.default(welcomeChannel);
    if (welcomeChannel)
        this.client.pGuilds.update(pGuild, module.exports.name, `Added welcome channel to **${this}**'s Pingu Guild.`);
    return welcomeChannel;
};
//#endregion
//#region GuildMember
discord_js_1.GuildMember.prototype.pGuildMember = function () {
    return this.client.pGuildMembers.get(this.guild).get(this);
};
//#endregion
//#region Message
discord_js_1.Message.prototype.reactioRoles = function () {
    try {
        const { guild } = this;
        if (!guild)
            throw { reason: 'No guild' };
        const pGuild = guild.pGuild();
        if (!pGuild)
            throw { reason: 'No pGuild' };
        return pGuild.settings.reactionRoles.reduce((result, rr) => {
            const emoji = guild.emojis.cache.find(e => e.name === rr.emoteName) || rr.emoteName;
            return result.set(emoji, rr);
        }, new discord_js_1.Collection());
    }
    catch (err) {
        if (err.reason)
            return new discord_js_1.Collection();
        throw err;
    }
};
discord_js_1.Message.prototype.editEmbeds = function (...embeds) {
    return this.edit({ embeds });
};
discord_js_1.Message.prototype.editFiles = function (...files) {
    return this.edit({ files });
};
//#endregion
//#region PartialTextBasedChannelFields
//#region sendEmbed
function sendEmbed(...embeds) {
    return this.send({ embeds });
}
discord_js_1.TextChannel.prototype.sendEmbeds = sendEmbed;
discord_js_1.NewsChannel.prototype.sendEmbeds = sendEmbed;
discord_js_1.DMChannel.prototype.sendEmbeds = sendEmbed;
discord_js_1.ThreadChannel.prototype.sendEmbeds = sendEmbed;
//#endregion
//#region sendFiles
function sendFiles(...files) {
    return this.send({ files });
}
discord_js_1.TextChannel.prototype.sendFiles = sendFiles;
discord_js_1.NewsChannel.prototype.sendFiles = sendFiles;
discord_js_1.DMChannel.prototype.sendFiles = sendFiles;
discord_js_1.ThreadChannel.prototype.sendFiles = sendFiles;
//#endregion
//#endregion
//#region User
discord_js_1.User.prototype.isPinguDev = function () {
    return this.client.developers.isPinguDev(this);
};
discord_js_1.User.prototype.pUser = function () {
    return this.client.pUsers.get(this);
};
//#endregion
