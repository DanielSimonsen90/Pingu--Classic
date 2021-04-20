import { Guild } from 'discord.js';
import { DecidablesConfig } from "../../decidable/config/DecidablesConfig";
import { GuildAchievementConfig } from "../achievements/config/GuildAchievementConfig";
export declare class PinguGuildConfig {
    constructor(guild: Guild);
    decidables: DecidablesConfig;
    achievements: GuildAchievementConfig;
}
