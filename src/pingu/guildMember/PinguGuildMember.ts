import { Collection, Guild, GuildMember, Snowflake } from "discord.js";
import { PGuildMember, PGuild } from "../../database/json";

import { cache as PinguGuildCache, GetPGuild, UpdatePGuild } from "../guild/PinguGuild";
import { cache as PinguUserCache } from "../user/PinguUser";

import { pGuildLog } from "../library/PinguLibrary";
import { GuildMemberAchievementConfig, GuildMemberAchievementNotificationType } from "../achievements/config/GuildMemberAchievementConfig";

export async function WritePGuildMember(member: GuildMember, log: boolean) {
    let pGuild = await GetPGuild(member.guild);
    let pGuildMember = new PinguGuildMember(member, pGuild.settings.config.achievements.notificationTypes.members);
    pGuild.members.set(member.id, pGuildMember);

    if (log) pGuildLog(member.client, "guildMemberAdd", `**${member.displayName}** was successfully added to **${pGuild.name}**'s PinguGuild's members.`)
    return pGuildMember;
}
export async function GetPGuildMember(member: GuildMember) {
    let pGuild = await GetPGuild(member.guild);
    let pgm = pGuild.members.get(member.id);

    if (pgm) return pgm;

    pgm = new PinguGuildMember(member, pGuild.settings.config.achievements.notificationTypes.members);
    pGuild.members.set(pgm._id, pgm);
    await UpdatePGuild(member.client, { members: pGuild.members }, pGuild, 'GetPGuildMember()',
        `Added **${pgm.name}** as a member of **${pGuild.name}**.`,
        `Failed to add **${pgm.name}** as a member of **${pGuild.name}**.`
    );
    return pgm;
}
export async function UpdatePGuildMember(member: GuildMember, pGuildMember: PinguGuildMember, scriptName: string, succMsg: string, errMsg: string) {
    let pGuild = await GetPGuild(member.guild);
    pGuild.members.set(pGuildMember._id, pGuildMember);
    return UpdatePGuild(member.client, { members: pGuild.members }, pGuild, scriptName, succMsg, errMsg);
}
export async function DeletePGuildMember(member: GuildMember) {
    let pGuild = await GetPGuild(member.guild);
    pGuild.members.delete(member.id);
    return UpdatePGuild(member.client, { members: pGuild.members }, pGuild, 'guildMemberRemove',
        `Successfully updated **${pGuild.name}**'s members, after **${member.user.tag}** left the guild.`,
        `Failed to remove **${member.user.tag}** from **${pGuild.name}**'s PinguGuild's members!`
    );
}
export async function GetPGuildMembers(guild: Guild) {
    let pGuild = await GetPGuild(guild);
    return (pGuild.members as Collection<Snowflake, PinguGuildMember>).array();
}

export class PinguGuildMember extends PGuildMember {
    //#region Statics
    public static async WritePGuildMember(member: GuildMember, log: boolean) { return WritePGuildMember(member, log); }
    public static async GetPGuildMember(member: GuildMember) { return GetPGuildMember(member); }
    public static async UpdatePGuildMember(guild: Guild, pGuildMember: PinguGuildMember, scriptName: string, succmsg: string, errMsg: string) 
    { return UpdatePGuildMember(guild, pGuildMember, scriptName, succmsg, errMsg); }
    public static async DeletePGuildMember(member: GuildMember) { return DeletePGuildMember(member); }
    public static async GetPGuildMembers(guild: Guild) { return GetPGuildMembers(guild); }
    //#endregion

    constructor(member: GuildMember, achievementNotificationType: GuildMemberAchievementNotificationType) {
        super(member);
        this.guild = new PGuild(member.guild);
        this.achievementsConfig = new GuildMemberAchievementConfig(achievementNotificationType);
    }

    public guild: PGuild;
    public achievementsConfig: GuildMemberAchievementConfig
    //public warnings: ??

    public pGuild() {
        return PinguGuildCache.get(this.guild._id);
    }
    public pUser() {
        return PinguUserCache.get(this._id);
    }

}
