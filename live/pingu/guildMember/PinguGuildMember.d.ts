import { Guild, GuildMember } from "discord.js";
import { PGuildMember, PGuild } from "../../database/json";
import { GuildMemberAchievementConfig, GuildMemberAchievementNotificationType } from "../achievements/config/GuildMemberAchievementConfig";
export declare function WritePGuildMember(member: GuildMember, scriptName: string): Promise<PinguGuildMember>;
export declare function GetPGuildMember(member: GuildMember, scriptName: string): Promise<PinguGuildMember>;
export declare function UpdatePGuildMember(member: GuildMember, pGuildMember: PinguGuildMember, scriptName: string, reason: string): Promise<PinguGuildMember>;
export declare function DeletePGuildMember(member: GuildMember): Promise<void>;
export declare function GetPGuildMembers(guild: Guild): Promise<PinguGuildMember[]>;
export declare class PinguGuildMember extends PGuildMember {
    /**Writes and adds Member as PinguGuildMember to database and returns the new object
     * @param member Member to add as PinguGuildMember
     * @param log Whether to log it in #pGuildLog or not
     * @returns The new PinguGuildMember*/
    static Write(member: GuildMember, scriptName: string): Promise<PinguGuildMember>;
    /**Get the PinguGuildMember from provided member
     * @param member Member to get as PinguGuildMember
     * @param scriptName Script that called the method
     * @returns The provided member as PinguGuildMember*/
    static Get(member: GuildMember, scriptName: string): Promise<PinguGuildMember>;
    /**Updates provided PinguGuildMember to the database
     * @param member Member to update
     * @param pGuildMember PinguGuildMember update
     * @param scriptName Script that called the method
     * @param reason Reason for updating the PinguGuildMember
     * @returns The updated PinguGuildMember*/
    static Update(member: GuildMember, pGuildMember: PinguGuildMember, scriptName: string, reason: string): Promise<PinguGuildMember>;
    /**Deletes provided member from their guild's PinguGuild's members map
     * @param member Member to delete
     * @returns what should it return?*/
    static Delete(member: GuildMember): Promise<void>;
    /**Get all PinguGuildMembers from specified guild
     * @param guild Guild to get all PinguGuildMembers from
     * @returns All PinguGuildMembers from specified guild*/
    static GetGuildMembers(guild: Guild): Promise<PinguGuildMember[]>;
    constructor(member: GuildMember, achievementNotificationType: GuildMemberAchievementNotificationType);
    guild: PGuild;
    achievementConfig: GuildMemberAchievementConfig;
}
export default PinguGuildMember;
