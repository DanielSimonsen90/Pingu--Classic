import { Guild } from "discord.js";
import { AchievementBase } from "./AchievementBase";
import { GuildAchievementType } from "./GuildAchievement";
import { Percentage } from "../../../helpers";
export interface GuildMemberAchievementType extends GuildAchievementType {
}
export declare type GuildMemberAchievementTypeKey = keyof GuildMemberAchievementType;
export declare class GuildMemberAchievement<Key extends keyof GuildAchievementType> extends AchievementBase {
    constructor(id: number, name: string, key: Key, type: GuildAchievementType[Key], description: string);
    key: Key;
    type: GuildMemberAchievementType[Key];
    getPercentage(guild: Guild): Promise<Percentage>;
    static Achievements: GuildMemberAchievement<GuildMemberAchievementTypeKey>[];
}
