import { Guild } from "discord.js";
import { GiveawayConfig, PollConfig, SuggestionConfig, ThemeConfig } from '.';
export declare class DecidablesConfig {
    constructor(guild: Guild);
    giveawayConfig: GiveawayConfig;
    pollConfig: PollConfig;
    suggestionConfig: SuggestionConfig;
    themeConfig: ThemeConfig;
}
