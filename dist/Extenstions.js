"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const voice_1 = require("@discordjs/voice");
const PChannel_1 = require("./database/json/PChannel");
const Arguments_1 = require("./helpers/Arguments");
const Array_1 = require("./helpers/Array");
const TimeSpan_1 = require("./helpers/TimeSpan");
Array.prototype.pArray = function () {
    return new Array_1.default(...this);
};
String.prototype.toPascalCase = function () {
    return this.substring(0, 1).toUpperCase() + this.substring(1);
};
String.prototype.clip = function (start, end) {
    return this.substring(start, end < 0 ? this.length - end : end);
};
//#region Base
discord_js_1.Base.prototype.doIn = function (callback, time) {
    const timeout = typeof time == 'number' ? time : (0, TimeSpan_1.TimeString)(time);
    return new Promise((resolve, reject) => {
        try {
            setTimeout(() => resolve(callback(this)), timeout);
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
    return (0, voice_1.joinVoiceChannel)({
        channelId: this.id,
        guildId: this.guildId,
        adapterCreator: this.guild.voiceAdapterCreator
    });
};
//#endregion
//#region Collection
discord_js_1.Collection.prototype.array = function () {
    return this.reduce((arr, v, k) => {
        arr.push([k, v]);
        return arr;
    }, new Array_1.default());
};
discord_js_1.Collection.prototype.keyArr = function () {
    return new Array_1.default(...this.keys());
};
discord_js_1.Collection.prototype.valueArr = function () {
    return new Array_1.default(...this.values());
};
discord_js_1.Collection.prototype.findFromString = function (value) {
    return [
        this.find(v => v.id == value),
        this.find(v => v.tag == value),
        this.find(v => v.name == value),
        this.find(v => v.displayName == value),
    ].filter(v => v)[0];
};
//#endregion
//#region CommandInteraction
discord_js_1.CommandInteraction.prototype.replyPrivate = function (options) {
    const _options = typeof options == 'string' ?
        { content: options } :
        { ...options };
    return this.reply({ ephemeral: true, ..._options, fetchReply: true });
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
//#region MessageMentions
discord_js_1.MessageMentions.prototype.messages = function (message) {
    const args = new Arguments_1.default(message.content);
    const messageMentions = args.getAll(args.mentions.get('SNOWFLAKE').regex);
    if (!messageMentions.length)
        return new discord_js_1.Collection();
    const messages = messageMentions.map(id => this.client.channels.cache.filter(c => c.isText())
        .map(c => c.isText() && c.messages.cache.get(id))).flat().filter(v => v);
    return messages.reduce((result, m) => result.set(m.id, m), new discord_js_1.Collection());
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
//#region Role
discord_js_1.Role.prototype.addPermissions = function (idk) {
    const permissions = idk.reason ? idk.permissions : idk;
    const reason = idk.reason;
    return this.setPermissions([...this.permissions, ...permissions], reason);
};
discord_js_1.Role.prototype.removePermissions = function (idk) {
    const permissions = idk.reason ? idk.permissions : idk;
    const reason = idk.reason;
    return this.setPermissions(this.permissions.toArray().filter(p => !permissions.includes(p)), reason);
};
//#endregion
//#region User
discord_js_1.User.prototype.isPinguDev = function () {
    return this.client.developers.isPinguDev(this);
};
discord_js_1.User.prototype.pUser = function () {
    return this.client.pUsers.get(this);
};
