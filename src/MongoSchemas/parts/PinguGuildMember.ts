import PItem from "./PItem";
import AchievementConfig from "./AchievementConfig";

export const PinguGuildMember = { ...PItem,
    guild: PItem,
    achievementConfig: AchievementConfig
}

export default PinguGuildMember;