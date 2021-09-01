import { GuildAchievementType, GuildAchievementCallbackParams } from "./GuildAchievement";
export interface GuildMemberAchievementType extends GuildAchievementType {
}
export declare type GuildMemberAchievementTypeKey = keyof GuildMemberAchievementType;
export interface GuildMemberAchievementCallbackParams extends GuildAchievementCallbackParams {
}
import { Guild } from "discord.js";
import { IGuildMemberAchievement } from "./IAchievementBase";
import AchievementBase from "./AchievementBase";
import Percentage from "../../../helpers/Percentage";
import PinguClientShell from "../../client/PinguClientShell";
export declare class GuildMemberAchievement<Key extends keyof GuildMemberAchievementType, Type extends GuildMemberAchievementType[Key]> extends AchievementBase implements IGuildMemberAchievement<Key, Type, GuildMemberAchievementCallbackParams> {
    constructor(id: number, name: string, key: Key, type: Type, description: string);
    key: Key;
    type: Type;
    setCallback<setCBType extends keyof GuildMemberAchievementCallbackParams[Key]>(type: setCBType, callback: (params: GuildMemberAchievementCallbackParams[Key][setCBType]) => Promise<boolean>): this;
    callback(params: GuildMemberAchievementCallbackParams[Key][keyof GuildMemberAchievementCallbackParams[Key]]): Promise<boolean>;
    getPercentage(client: PinguClientShell, guild: Guild): Promise<Percentage>;
    private static DecidablesCheck;
    static Achievements: (GuildMemberAchievement<"EVENT", "guildMemberAdd"> | GuildMemberAchievement<"EVENT", "inviteCreate"> | GuildMemberAchievement<"EVENT", "messageDelete"> | GuildMemberAchievement<"EVENT", "messageUpdate"> | GuildMemberAchievement<"EVENT", "messageReactionAdd"> | GuildMemberAchievement<"COMMAND", "suggestion"> | GuildMemberAchievement<"COMMAND", "serverinfo"> | GuildMemberAchievement<"COMMAND", "whois"> | GuildMemberAchievement<"COMMAND", "clear"> | GuildMemberAchievement<"COMMAND", "boomer"> | GuildMemberAchievement<"COMMAND", "music"> | GuildMemberAchievement<"COMMAND", "quote"> | GuildMemberAchievement<"COMMAND", "viberate"> | GuildMemberAchievement<"CHANNEL", "Emotes"> | GuildMemberAchievement<"VOICE", "Streaming"> | GuildMemberAchievement<"VOICE", "Video"> | GuildMemberAchievement<"VOICE", "Noice"> | GuildMemberAchievement<"MODERATION", "Ban"> | GuildMemberAchievement<"MODERATION", "Kick"> | GuildMemberAchievement<"MODERATION", "Mute"> | GuildMemberAchievement<"MODERATION", "Unmute"> | GuildMemberAchievement<"MODERATION", "Unban"> | GuildMemberAchievement<"MODERATION", "Warn">)[];
}
export default GuildMemberAchievement;
