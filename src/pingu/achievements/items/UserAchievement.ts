import { AchievementBase, AchievementBaseType, noGuildOnlyCommands, AchievementCallbackParams } from "./AchievementBase";
import { PinguCommandParams } from "../../handlers/PinguCommand";
import { GetPUsers } from "../../user/PinguUser";
import { Percentage } from "../../../helpers";

export interface UserAchievementType extends AchievementBaseType {
    COMMAND: noGuildOnlyCommands
}
export type UserAchievementTypeKey = keyof UserAchievementType;

export interface UserAchievementCallbackParams extends AchievementCallbackParams {
    COMMAND: [PinguCommandParams]
}

export class UserAchievement
<Key extends keyof UserAchievementType, 
Type extends UserAchievementType[Key]> 
extends AchievementBase<Key, Type> {
    public async getPercentage() {
        let pUsers = await GetPUsers();
        let whole = pUsers.length;
        let part = pUsers.filter(pUser => pUser.achievementConfig.achievements.find(a => a._id == this._id)).length;
        return new Percentage(whole, part);
    }

    public static Achievements: UserAchievement<UserAchievementTypeKey, UserAchievementType[UserAchievementTypeKey]>[] = [
        // new UserAchievement(1, "Pingu? Yeah he's my best friend!", 'EVENT', 'guildMemberAdd', "Of all Pingu Users, you share the most servers with Pingu").setCallback('guildMemberAdd', params => params),
        // new UserAchievement(1, "test", 'CHAT', "Hello", "Say hello!").setCallback('0', message => message == 'Hello'),
        // new UserAchievement(1, "test", "COMMAND", "contact", "contact me")
        new UserAchievement(1, "testing again", 'COMMAND', 'gif', "Get a gif")
    ];
}