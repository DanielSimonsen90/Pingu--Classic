import { Guild } from "discord.js";
import { GiveawayConfig, PollConfig, SuggestionConfig, ThemeConfig } from './index'
import { SavedServers } from "../../pingu/library/PinguLibrary";

export class DecidablesConfig {
    constructor(guild: Guild) {
        this.giveawayConfig = new GiveawayConfig();
        this.pollConfig = new PollConfig();
        this.suggestionConfig = new SuggestionConfig();
        this.themeConfig = guild.id == SavedServers.get('Deadly Ninja').id ? new ThemeConfig() : undefined;
    }

    public giveawayConfig: GiveawayConfig;
    public pollConfig: PollConfig;
    public suggestionConfig: SuggestionConfig;
    public themeConfig: ThemeConfig;
}

export default DecidablesConfig;