export declare type Channels = 'Giveaway' | 'Poll' | 'Suggestion' | 'Emotes';
export declare type Voices = 'Connected' | 'Disconnected' | 'Move' | 'Deaf' | 'Mute' | 'Streaming' | 'Video' | 'Noice';
export declare type Moderation = 'Ban' | 'Unban' | 'Censor' | 'Clear' | 'Kick' | 'Logs' | 'Mute' | 'Unmute' | 'Warn';
import { Guild, GuildMember, User, GuildChannel } from "discord.js";
import { AchievementBase, AchievementBaseType, guildOnlyCommands, AchievementCallbackParams } from "./AchievementBase";
export interface GuildAchievementType extends AchievementBaseType {
    COMMAND: guildOnlyCommands;
    CHANNEL: Channels;
    VOICE: Voices;
    MODERATION: Moderation;
}
export declare type GuildAchievementTypeKey = keyof GuildAchievementType;
export interface GuildAchievementCallbackParams extends AchievementCallbackParams {
    MODERATION: [[Guild, GuildMember, User]];
    CHANNEL: [[GuildChannel]];
}
export declare function useChannel(channel: Channels, extraInfo: string): string;
import { IGuildAchievement } from "./IAchievementBase";
import Percentage from "../../../helpers/Percentage";
import BasePinguClient from '../../client/BasePinguClient';
import { DiscordIntentEvents } from "../../../helpers/IntentEvents";
export declare class GuildAchievement<Key extends keyof GuildAchievementType, Type extends GuildAchievementType[Key]> extends AchievementBase implements IGuildAchievement<Key, Type, GuildAchievementCallbackParams> {
    constructor(id: number, name: string, key: Key, type: Type, description: string);
    key: Key;
    type: Type;
    setCallback<setCBType extends keyof GuildAchievementCallbackParams[Key]>(type: setCBType, callback: (params: GuildAchievementCallbackParams[Key][setCBType]) => Promise<boolean>): this;
    callback(params: GuildAchievementCallbackParams[Key][keyof GuildAchievementCallbackParams[Key]]): Promise<boolean>;
    getPercentage<Intents extends DiscordIntentEvents = DiscordIntentEvents>(client: BasePinguClient<Intents>): Promise<Percentage>;
    protected static useCommand(command: guildOnlyCommands, extraInfo: string): string;
    static Achievements: (GuildAchievement<"EVENT", "messageDelete"> | GuildAchievement<"EVENT", "messageDeleteBulk"> | GuildAchievement<"COMMAND", "giveaway"> | GuildAchievement<"COMMAND", "poll"> | GuildAchievement<"COMMAND", "suggestion"> | GuildAchievement<"COMMAND", "clear"> | GuildAchievement<"COMMAND", "embed"> | GuildAchievement<"COMMAND", "prefix"> | GuildAchievement<"COMMAND", "publish"> | GuildAchievement<"COMMAND", "reactionroles"> | GuildAchievement<"COMMAND", "slowmode"> | GuildAchievement<"COMMAND", "activity"> | GuildAchievement<"COMMAND", "music"> | GuildAchievement<"CHANNEL", "Giveaway"> | GuildAchievement<"CHANNEL", "Poll"> | GuildAchievement<"CHANNEL", "Suggestion"> | GuildAchievement<"VOICE", "Streaming"> | GuildAchievement<"VOICE", "Video"> | GuildAchievement<"MODERATION", "Logs"> | GuildAchievement<"EVENT", "chosenGuild">)[];
}
export default GuildAchievement;
