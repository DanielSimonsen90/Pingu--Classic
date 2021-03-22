import { AchievementBase, AchievementBaseType, guildOnlyCommands } from "./AchievementBase";
import { Percentage } from "../../../helpers";
export interface GuildAchievementType extends AchievementBaseType {
    COMMAND: guildOnlyCommands;
    CHANNEL: 'Giveaway' | 'Poll' | 'Suggestion' | 'Emotes' | 'Publish' | 'Clear' | 'Prefix' | 'Slowmode' | 'Role' | 'Music';
    VOICE: 'Connected' | 'Disconnected' | 'Move' | 'Deaf' | 'Mute' | 'Streaming' | 'Video' | 'Noice';
}
export declare type GuildAchievementTypeKey = keyof GuildAchievementType;
export declare class GuildAchievement<Key extends GuildAchievementTypeKey> extends AchievementBase {
    constructor(id: number, name: string, key: Key, type: GuildAchievementType[Key], description: string);
    key: Key;
    type: GuildAchievementType[Key];
    getPercentage(): Promise<Percentage>;
    static Achievements: GuildAchievement<GuildAchievementTypeKey>[];
}
