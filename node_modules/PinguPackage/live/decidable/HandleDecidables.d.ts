import { Message } from 'discord.js';
import { PClient } from '../database/json';
import PinguGuild from '../pingu/guild/PinguGuild';
import { GiveawayConfig, PollConfig, SuggestionConfig, ThemeConfig } from '../decidable/config';
declare enum DecidablesEnum {
    Giveaway = "Giveaway",
    Poll = "Poll",
    Suggestion = "Suggestion",
    Theme = "Theme"
}
declare type DecidablesTypes = keyof typeof DecidablesEnum;
interface DecidablesParams {
    message: Message;
    args: string[];
    pGuild: PinguGuild;
    pGuildClient: PClient;
    decidablesType: DecidablesTypes;
    reactionEmojis: string[];
    listEmojis: string[];
    config: GiveawayConfig | PollConfig | SuggestionConfig | ThemeConfig;
}
export declare function HandleDecidables(params: DecidablesParams): Promise<void | Message>;
export default HandleDecidables;
