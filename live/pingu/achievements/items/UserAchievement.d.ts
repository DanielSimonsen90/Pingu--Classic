import { AchievementBase, AchievementBaseType, noGuildOnlyCommands } from "./AchievementBase";
import { Percentage } from "../../../helpers";
export interface UserAchievementType extends AchievementBaseType {
    COMMAND: noGuildOnlyCommands;
}
export declare type UserAchievementTypeKey = keyof UserAchievementType;
export declare class UserAchievement<Key extends UserAchievementTypeKey> extends AchievementBase {
    constructor(id: number, name: string, key: Key, type: UserAchievementType[Key], description: string);
    key: Key;
    type: UserAchievementType[Key];
    getPercentage(): Promise<Percentage>;
    static Achievements: UserAchievement<UserAchievementTypeKey>[];
}
