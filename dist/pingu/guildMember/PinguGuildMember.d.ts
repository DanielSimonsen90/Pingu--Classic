import { GuildMember } from "discord.js";
import { PGuildMember, PGuild } from "../../database/json";
import { GuildMemberAchievementConfig, GuildMemberAchievementNotificationType } from "../achievements/config/GuildMemberAchievementConfig";
export declare class PinguGuildMember extends PGuildMember {
    constructor(member: GuildMember, achievementNotificationType: GuildMemberAchievementNotificationType);
    guild: PGuild;
    achievementConfig: GuildMemberAchievementConfig;
}
export default PinguGuildMember;
