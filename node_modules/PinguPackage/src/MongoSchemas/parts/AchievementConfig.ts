import Achievement from "./Achievement";
import PItem from "./PItem";

export const AchievementConfig = {
    notificationType: String,
    achievements: [Achievement],
    enabled: Boolean,
    channel: PItem
}
export const GuildAchievementsConfig = { ...AchievementConfig,
    guildID: String,
    notificationTypes: {
        guild: String,
        members: String
    }
}

export default AchievementConfig;