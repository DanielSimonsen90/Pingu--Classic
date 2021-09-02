import { Guild, Message, User, GuildMember } from 'discord.js';
import BasePinguClient from '../client/BasePinguClient';
import { AchieverTypes, AchievementBaseType } from "./items/AchievementBase";
import { UserAchievement, UserAchievementType, UserAchievementTypeKey, UserAchievementCallbackParams } from "./items/UserAchievement";
import { GuildMemberAchievement, GuildMemberAchievementType, GuildMemberAchievementTypeKey, GuildMemberAchievementCallbackParams } from "./items/GuildMemberAchievement";
import { GuildAchievement, GuildAchievementType, GuildAchievementTypeKey, GuildAchievementCallbackParams } from "./items/GuildAchievement";
import UserAchievementConfig from "./config/UserAchievementConfig";
import GuildMemberAchievementConfig from "./config/GuildMemberAchievementConfig";
import GuildAchievementConfig from "./config/GuildAchievementConfig";
interface Achievements {
    USER: UserAchievement<UserAchievementTypeKey, UserAchievementType[UserAchievementTypeKey]>;
    GUILDMEMBER: GuildMemberAchievement<GuildMemberAchievementTypeKey, GuildMemberAchievementType[GuildMemberAchievementTypeKey]>;
    GUILD: GuildAchievement<GuildAchievementTypeKey, GuildMemberAchievementType[GuildMemberAchievementTypeKey]>;
}
interface AchievementTypes {
    USER: UserAchievementType;
    GUILDMEMBER: GuildMemberAchievementType;
    GUILD: GuildAchievementType;
}
interface AchieverConfigs {
    USER: UserAchievementConfig;
    GUILDMEMBER: GuildMemberAchievementConfig;
    GUILD: GuildAchievementConfig;
}
interface Achievers {
    USER: User;
    GUILDMEMBER: GuildMember;
    GUILD: Guild;
}
interface AchievementCallbackParams {
    USER: UserAchievementCallbackParams;
    GUILDMEMBER: GuildMemberAchievementCallbackParams;
    GUILD: GuildAchievementCallbackParams;
}
export declare function AchievementCheckType<AchieverType extends AchieverTypes, AchievementType extends Achievements[AchieverType], Key extends keyof AchievementTypes[AchieverType], Type extends AchievementTypes[AchieverType][Key], CallbackKey extends keyof AchievementCallbackParams[AchieverType]>(client: BasePinguClient, achieverType: AchieverType, achiever: Achievers[AchieverType], key: Key, keyType: Type, config: AchieverConfigs[AchieverType], callbackKey: CallbackKey, callback: AchievementCallbackParams[AchieverType][CallbackKey][keyof AchievementCallbackParams[AchieverType][CallbackKey]]): Promise<Message>;
export interface AchievementCheckData {
    user: User;
    guildMember?: GuildMember;
    guild?: Guild;
}
export declare function AchievementCheck<AchievementType extends GuildMemberAchievementType | GuildAchievementType | AchievementBaseType, Key extends keyof AchievementType, Type extends AchievementType[Key]>(client: BasePinguClient, data: AchievementCheckData, key: Key, type: Type, callback: any[]): Promise<boolean>;
export {};
