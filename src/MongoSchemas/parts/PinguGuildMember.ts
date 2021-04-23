import { PItem } from "./PItem";
import { AchievementsConfig } from "./AchievementsConfig";

export const PinguGuildMember = { ...PItem,
    guild: PItem,
    achievementConfig: AchievementsConfig
}