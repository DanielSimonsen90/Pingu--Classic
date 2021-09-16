import { AchievementBase, AchievementBaseType, noGuildOnlyCommands, AchievementCallbackParams } from "./AchievementBase";
export interface UserAchievementType extends AchievementBaseType {
    COMMAND: noGuildOnlyCommands;
}
export declare type UserAchievementTypeKey = keyof UserAchievementType;
export interface UserAchievementCallbackParams extends AchievementCallbackParams {
}
import { IUserAchievement } from "./IAchievementBase";
import Percentage from "../../../helpers/Percentage";
import PinguClientBase from '../../client/PinguClientBase';
export declare class UserAchievement<Key extends keyof UserAchievementType, Type extends UserAchievementType[Key]> extends AchievementBase implements IUserAchievement<Key, Type, AchievementCallbackParams> {
    constructor(id: number, name: string, key: Key, type: Type, description: string);
    key: Key;
    type: Type;
    setCallback<setCBType extends keyof AchievementCallbackParams[Key]>(type: setCBType, callback: (params: AchievementCallbackParams[Key][setCBType]) => Promise<boolean>): this;
    callback(params: AchievementCallbackParams[Key][keyof AchievementCallbackParams[Key]]): Promise<boolean>;
    getPercentage(client: PinguClientBase): Promise<Percentage>;
    private static DailyStreak;
    static Achievements: (UserAchievement<"EVENT", "mostKnownUser"> | UserAchievement<"EVENT", "guildCreate"> | UserAchievement<"EVENT", "guildDelete"> | UserAchievement<"EVENT", "userUpdate"> | UserAchievement<"COMMAND", "help"> | UserAchievement<"COMMAND", "info"> | UserAchievement<"COMMAND", "ping"> | UserAchievement<"COMMAND", "spinthewheel"> | UserAchievement<"COMMAND", "meme"> | UserAchievement<"COMMAND", "daily"> | UserAchievement<"COMMAND", "tell"> | UserAchievement<"COMMAND", "fact"> | UserAchievement<"COMMAND", "noot"> | UserAchievement<"COMMAND", "contact"> | UserAchievement<"COMMAND", "invite"> | UserAchievement<"COMMAND", "marry"> | UserAchievement<"EVENT", "chosenUser">)[];
}
export default UserAchievement;