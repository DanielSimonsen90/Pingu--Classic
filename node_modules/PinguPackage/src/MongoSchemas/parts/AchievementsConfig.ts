import { Achievement } from "./Achievement";
import { PItem } from "./PItem";

export const AchievementsConfig = {
    notificationType: String,
    achievements: [Achievement],
    enabled: Boolean,
    channel: PItem
}
export const GuildAchievementsConfig = { ...AchievementsConfig,
    guildID: String,
    notificationTypes: {
        guild: String,
        members: String
    }
}