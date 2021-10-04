"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PinguGuildMemberCollection = void 0;
const discord_js_1 = require("discord.js");
const PinguGuildMember_1 = require("../guildMember/PinguGuildMember");
const IPinguCollection_1 = require("./IPinguCollection");
const GuildAchievementConfig_1 = require("../achievements/config/GuildAchievementConfig");
const achievements_1 = require("../achievements");
class PinguGuildMemberCollection extends IPinguCollection_1.default {
    constructor(client, logChannelName, guild) {
        super(client, logChannelName, 'PinguGuildMember', gm => new PinguGuildMember_1.default(gm, client.pGuilds.get(gm.guild).settings.config.achievements.notificationTypes.members), (c, pgm) => c.guilds.cache.get(pgm.guild._id).members);
        this._guild = guild;
    }
    _guild;
    get pGuild() {
        return this._client.pGuilds.get(this._guild);
    }
    async add(item, scriptName, reason = `${item.user.tag} was added to ${item.guild.name}'s PinguGuild.members.`) {
        if (item.user.bot)
            return null;
        const client = item.client;
        if (!this.pGuild.settings.config.achievements.notificationTypes) {
            this.pGuild.settings.config.achievements = new GuildAchievementConfig_1.default({ guild: 'NONE', members: 'NONE' }, this.pGuild._id);
            await client.pGuilds.update(this.pGuild, `WritePGuildMember: ${scriptName}`, 'PinguGuild did not have NotificationType');
        }
        const pgm = this._newPT(item, client);
        this.pGuild.members.set(pgm._id, pgm);
        this._inner.set(pgm._id, pgm);
        await client.pGuilds.update(this.pGuild, scriptName, reason);
        //Add join achievement
        await (0, achievements_1.AchievementCheckType)(client, 'GUILDMEMBER', item, 'EVENT', 'guildMemberAdd', pgm.achievementConfig, 'EVENT', [item]);
        return pgm;
    }
    async update(pItem, scriptName, reason) {
        this.pGuild.members.set(pItem._id, pItem);
        this._inner.set(pItem._id, pItem);
        this._client.pGuilds.update(this.pGuild, scriptName, reason);
        return pItem;
    }
    async delete(item, scriptName, reason) {
        this.pGuild.members.delete(item.id);
        this._inner.delete(item.id);
        this._client.pGuilds.update(this.pGuild, 'guildMemberRemove', `**${this.pGuild.name}**'s members, after **${item.user.tag}** left the guild.`);
        return this;
    }
    async refresh(client, startUp) {
        if (client)
            this._client = client;
        this._guild = this._client.guilds.cache.get(this._guild.id);
        const mapMembers = this._client.pGuilds.get(this._client.guilds.cache.get(this.pGuild._id)).members;
        this._inner = new discord_js_1.Collection();
        for (const [id, member] of mapMembers) {
            this._inner.set(id, member);
        }
        if (!startUp)
            this._client.log('console', `Successfull refreshed entries for **PinguGuildMember**.`);
        return this;
    }
    get(item) {
        return this.pGuild.members.get(item.id);
    }
}
exports.PinguGuildMemberCollection = PinguGuildMemberCollection;
exports.default = PinguGuildMemberCollection;
