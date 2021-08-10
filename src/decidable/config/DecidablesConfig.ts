import { Guild } from "discord.js";
import { GiveawayConfig, PollConfig, SuggestionConfig, ThemeConfig } from './index';
import { ToBasePinguClient } from '../../pingu/client/BasePinguClient'

export class DecidablesConfig {
    constructor(guild: Guild) {
        const client = ToBasePinguClient(guild.client);

        this.giveawayConfig = new GiveawayConfig();
        this.pollConfig = new PollConfig();
        this.suggestionConfig = new SuggestionConfig();
        this.themeConfig = guild.id == client.savedServers.get('Deadly Ninja').id ? new ThemeConfig() : undefined;
    }

    public giveawayConfig: GiveawayConfig;
    public pollConfig: PollConfig;
    public suggestionConfig: SuggestionConfig;
    public themeConfig: ThemeConfig;
}

export default DecidablesConfig;