import { Collection, Guild, GuildMember, Snowflake } from "discord.js";
import { PGuildMember, PGuild } from "../../database/json";

import { GetPGuild, UpdatePGuild } from "../guild/PinguGuild";

import { AchievementCheckType } from "../library/PinguLibrary";
import { GuildMemberAchievementConfig, GuildMemberAchievementNotificationType } from "../achievements/config/GuildMemberAchievementConfig";
import { GuildAchievementConfig } from '../achievements/config/GuildAchievementConfig';
 
export async function WritePGuildMember(member: GuildMember, scriptName: string) {
    if (member.user.bot) return null;
    const { client, guild, id } = member;
    
    let pGuild = await GetPGuild(guild);
    if (!pGuild.settings.config.achievements.notificationTypes) {
        pGuild.settings.config.achievements = new GuildAchievementConfig({ guild: 'NONE', members: 'NONE' }, pGuild._id);
        await UpdatePGuild(client, ['settings'], pGuild, "WritePGuildMember, " + scriptName, 'PinguGuild did not have NotificationType');    
    }

    let pGuildMember = new PinguGuildMember(member, pGuild.settings.config.achievements.notificationTypes.members);
    pGuild.members.set(id, pGuildMember);
    await UpdatePGuild(client, ['members'], pGuild, scriptName, `${member.user.tag} was added to ${pGuild.name}'s PinguGuild.members.`)

    //Add join achievement
    await AchievementCheckType(client, 'GUILDMEMBER', member, 'EVENT', 'guildMemberAdd', pGuildMember.achievementConfig, 'EVENT', [member]);

    return pGuildMember;
}
export async function GetPGuildMember(member: GuildMember, scriptName: string) {
    if (!member) return null;
    let pGuild = await GetPGuild(member.guild);
    let pgm = pGuild.members.get(member.id); //Can returns Mongoose.Document<PinguGuildMember>(?)
    return pgm ? (pgm as any).toObject ? (pgm as any).toObject() as PinguGuildMember : pgm : WritePGuildMember(member, scriptName)
}
export async function UpdatePGuildMember(member: GuildMember, pGuildMember: PinguGuildMember, scriptName: string, reason: string) {
    let pGuild = await GetPGuild(member.guild);
    pGuild.members.set(pGuildMember._id, pGuildMember);

    UpdatePGuild(member.client, ['members'], pGuild, scriptName, reason);
    return pGuildMember;
}
export async function DeletePGuildMember(member: GuildMember) {
    let pGuild = await GetPGuild(member.guild);
    pGuild.members.delete(member.id);
    UpdatePGuild(member.client, ['members'], pGuild, 'guildMemberRemove', `**${pGuild.name}**'s members, after **${member.user.tag}** left the guild.`);
    return;
}
export async function GetPGuildMembers(guild: Guild) {
    let pGuild = await GetPGuild(guild);
    let members = new Array<PinguGuildMember>();
    pGuild.members.forEach(v => members.push(v));
    return members;
}

export class PinguGuildMember extends PGuildMember {
    //#region Statics
    /**Writes and adds Member as PinguGuildMember to database and returns the new object
     * @param member Member to add as PinguGuildMember
     * @param log Whether to log it in #pGuildLog or not
     * @returns The new PinguGuildMember*/
    public static async Write(member: GuildMember, scriptName: string) { return WritePGuildMember(member, scriptName); }
    /**Get the PinguGuildMember from provided member
     * @param member Member to get as PinguGuildMember
     * @param scriptName Script that called the method
     * @returns The provided member as PinguGuildMember*/
    public static async Get(member: GuildMember, scriptName: string) { return GetPGuildMember(member, scriptName); }
    /**Updates provided PinguGuildMember to the database
     * @param member Member to update
     * @param pGuildMember PinguGuildMember update
     * @param scriptName Script that called the method
     * @param reason Reason for updating the PinguGuildMember
     * @returns The updated PinguGuildMember*/
    public static async Update(member: GuildMember, pGuildMember: PinguGuildMember, scriptName: string, reason: string)  { return UpdatePGuildMember(member, pGuildMember, scriptName, reason); }
    /**Deletes provided member from their guild's PinguGuild's members map
     * @param member Member to delete
     * @returns what should it return?*/
    public static async Delete(member: GuildMember) { return DeletePGuildMember(member); }
    /**Get all PinguGuildMembers from specified guild
     * @param guild Guild to get all PinguGuildMembers from
     * @returns All PinguGuildMembers from specified guild*/
    public static async GetGuildMembers(guild: Guild) { return GetPGuildMembers(guild); }
    //#endregion

    constructor(member: GuildMember, achievementNotificationType: GuildMemberAchievementNotificationType) {
        super(member);
        this.guild = new PGuild(member.guild);
        this.achievementConfig = new GuildMemberAchievementConfig(achievementNotificationType);
    }

    public guild: PGuild;
    public achievementConfig: GuildMemberAchievementConfig
    //public warnings: ??
}

export default PinguGuildMember;