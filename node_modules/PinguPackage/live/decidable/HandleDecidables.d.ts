import { Message } from 'discord.js';
import { GiveawayConfig, PollConfig, SuggestionConfig, ThemeConfig } from './config';
import PClient from '../database/json/PClient';
import PinguGuild from '../pingu/guild/PinguGuild';
import PinguClient from '../pingu/client/PinguClient';
import Arguments from '../helpers/Arguments';
export declare type DecidablesTypes = 'Giveaway' | 'Poll' | 'Suggestion' | 'Theme';
interface DecidablesParams {
    client: PinguClient;
    message: Message;
    args: Arguments;
    pGuild: PinguGuild;
    pGuildClient: PClient;
    decidablesType: DecidablesTypes;
    reactionEmojis: string[];
    config: GiveawayConfig | PollConfig | SuggestionConfig | ThemeConfig;
}
export declare function HandleDecidables(params: DecidablesParams): Promise<void | Message>;
export default HandleDecidables;
