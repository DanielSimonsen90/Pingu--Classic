import { GuildMember } from "discord.js";
import { PGuildMember, PGuild } from "../../database/json";
import { GuildMemberAchievementConfig, GuildMemberAchievementNotificationType } from "../achievements/config/GuildMemberAchievementConfig";

export class PinguGuildMember extends PGuildMember {
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