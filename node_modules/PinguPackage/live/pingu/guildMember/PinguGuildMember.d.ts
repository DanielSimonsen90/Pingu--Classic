import { Guild, GuildMember } from "discord.js";
import { PGuildMember, PGuild } from "../../database/json";
import { GuildMemberAchievementConfig, GuildMemberAchievementNotificationType } from "../achievements/config/GuildMemberAchievementConfig";
export declare function WritePGuildMember(member: GuildMember, log: boolean): Promise<PinguGuildMember>;
export declare function GetPGuildMember(member: GuildMember): Promise<PinguGuildMember>;
export declare function UpdatePGuildMember(member: GuildMember, pGuildMember: PinguGuildMember, scriptName: string, succMsg: string, errMsg: string): Promise<any>;
export declare function DeletePGuildMember(member: GuildMember): Promise<any>;
export declare function GetPGuildMembers(guild: Guild): Promise<PinguGuildMember[]>;
export declare class PinguGuildMember extends PGuildMember {
    static WritePGuildMember(member: GuildMember, log: boolean): Promise<PinguGuildMember>;
    static GetPGuildMember(member: GuildMember): Promise<PinguGuildMember>;
    static UpdatePGuildMember(member: GuildMember, pGuildMember: PinguGuildMember, scriptName: string, succmsg: string, errMsg: string): Promise<any>;
    static DeletePGuildMember(member: GuildMember): Promise<any>;
    static GetPGuildMembers(guild: Guild): Promise<PinguGuildMember[]>;
    constructor(member: GuildMember, achievementNotificationType: GuildMemberAchievementNotificationType);
    guild: PGuild;
    achievementsConfig: GuildMemberAchievementConfig;
    pGuild(): import("../guild/PinguGuild").PinguGuild;
    pUser(): import("../user/PinguUser").PinguUser;
}
