export interface IAchievementBase<Key, Type> {
    key: Key;
    type: Type;
}
import { UserAchievementCallbackParams, UserAchievementType } from "./UserAchievement";
export interface IUserAchievement<Key extends keyof UserAchievementType, Type extends UserAchievementType[Key], CallbackParams extends UserAchievementCallbackParams> extends IAchievementBase<Key, Type> {
    setCallback<setCBType extends keyof CallbackParams[Key]>(type: setCBType, callback: (...params: CallbackParams[Key][setCBType][]) => Promise<boolean>): this;
    callback(...params: CallbackParams[Key][keyof CallbackParams[Key]][]): Promise<boolean>;
}
import { GuildMemberAchievementCallbackParams, GuildMemberAchievementType } from "./GuildMemberAchievement";
export interface IGuildMemberAchievement<Key extends keyof GuildMemberAchievementType, Type extends GuildMemberAchievementType[Key], CallbackParams extends GuildMemberAchievementCallbackParams> extends IAchievementBase<Key, Type> {
    setCallback<setCBType extends keyof CallbackParams[Key]>(type: setCBType, callback: (...params: CallbackParams[Key][setCBType][]) => Promise<boolean>): this;
    callback(...params: CallbackParams[Key][keyof CallbackParams[Key]][]): Promise<boolean>;
}
import { GuildAchievementCallbackParams, GuildAchievementType } from "./GuildAchievement";
export interface IGuildAchievement<Key extends keyof GuildAchievementType, Type extends GuildAchievementType[Key], CallbackParams extends GuildAchievementCallbackParams> extends IAchievementBase<Key, Type> {
    setCallback<setCBType extends keyof CallbackParams[Key]>(type: setCBType, callback: (...params: CallbackParams[Key][setCBType][]) => Promise<boolean>): this;
    callback(...params: CallbackParams[Key][keyof CallbackParams[Key]][]): Promise<boolean>;
}
export default IAchievementBase;
