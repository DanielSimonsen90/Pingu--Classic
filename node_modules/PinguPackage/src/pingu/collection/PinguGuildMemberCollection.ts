import { CategoryChannel, TextChannel, Snowflake, Collection, GuildMember, Guild } from 'discord.js';
import BasePinguClient from '../client/BasePinguClient';
import PinguGuildMember from '../guildMember/PinguGuildMember';
import IPinguCollection from './IPinguCollection';

import GuildAchievementConfig from '../achievements/config/GuildAchievementConfig'
import { AchievementCheckType } from "../achievements";

export class PinguGuildMemberCollection extends IPinguCollection<GuildMember, PinguGuildMember> {
    constructor(client: BasePinguClient, logChannelName: string, guild: Guild) {
        super(client, logChannelName, 'PinguGuildMember', 
            gm => new PinguGuildMember(gm, client.pGuilds.get(gm.guild).settings.config.achievements.notificationTypes.members), 
            (c, pt) => c.guilds.cache.get(pt.guild._id).members
        );
        
        this._guild = guild;
    }

    private _guild: Guild
    private get pGuild() {
        return this._client.pGuilds.get(this._guild);
    }

    public async add(item: GuildMember, scriptName: string, reason: string = `${item.user.tag} was added to ${item.guild.name}'s PinguGuild.members.`): Promise<PinguGuildMember> {
        if (item.user.bot) return null;

        const client = item.client as BasePinguClient;
        if (!this.pGuild.settings.config.achievements.notificationTypes) {
            this.pGuild.settings.config.achievements = new GuildAchievementConfig({ guild: 'NONE', members: 'NONE' }, this.pGuild._id);
            await client.pGuilds.update(this.pGuild, `WritePGuildMember: ${scriptName}`, 'PinguGuild did not have NotificationType')
        }

        const pgm = this._newPT(item, client);
        this.pGuild.members.set(pgm._id, pgm);
        this._inner.set(pgm._id, pgm);
        await client.pGuilds.update(this.pGuild, scriptName, reason)

        //Add join achievement
        await AchievementCheckType(client, 'GUILDMEMBER', item, 'EVENT', 'guildMemberAdd', pgm.achievementConfig, 'EVENT', [item]);

        return pgm;
    }
    public async update(pItem: PinguGuildMember, scriptName: string, reason: string): Promise<PinguGuildMember> {
        this.pGuild.members.set(pItem._id, pItem);
        this._inner.set(pItem._id, pItem);

        this._client.pGuilds.update(this.pGuild, scriptName, reason);
        return pItem;
    }
    public async delete(item: GuildMember, scriptName: string, reason: string): Promise<this> {
        this.pGuild.members.delete(item.id);
        this._inner.delete(item.id);
        this._client.pGuilds.update(this.pGuild, 'guildMemberRemove', `**${this.pGuild.name}**'s members, after **${item.user.tag}** left the guild.`);
        return this;
    }
    public async refresh(client?: BasePinguClient): Promise<this> {
        if (client) this._client = client;
        this._guild = this._client.guilds.cache.get(this._guild.id);
        
        const mapMembers = this._client.pGuilds.get(this._client.guilds.cache.get(this.pGuild._id)).members;

        this._inner = new Collection();
        for (const [id, member] of mapMembers) {
            this._inner.set(id, member);
        }

        this._client.log('console', `Successfull refreshed entries for **PinguGuildMember**.`);
        return this;
    }

    public get(item: GuildMember) {
        return this.pGuild.members.get(item.id);
    }
}

export default PinguGuildMemberCollection;