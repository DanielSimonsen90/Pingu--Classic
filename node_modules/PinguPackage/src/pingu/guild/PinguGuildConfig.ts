import { Guild } from 'discord.js';
import { DecidablesConfig } from "../../decidable/config/DecidablesConfig";
import { GuildAchievementConfig } from "../achievements/config/GuildAchievementConfig";

export class PinguGuildConfig {
    constructor(guild: Guild) {
        this.decidables = new DecidablesConfig(guild);
        this.achievements = new  GuildAchievementConfig({
            guild: 'NONE',
            members: 'NONE'
        }, guild.id);
    }

    public decidables: DecidablesConfig;
    public achievements: GuildAchievementConfig
}