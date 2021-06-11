export declare enum CommandCategories {
    'Utility' = 0,
    'Fun' = 1,
    'Supporting' = 2,
    'DevOnly' = 3,
    'GuildSpecific' = 4
}
declare type CommandCategoriesType = keyof typeof CommandCategories;
import PinguClient from "../client/PinguClient";
import { Message, PermissionString, Snowflake, VoiceConnection } from 'discord.js';
import PinguUser from '../user/PinguUser';
import PinguGuildMember from '../guildMember/PinguGuildMember';
import PinguGuild from '../guild/PinguGuild';
import PClient from '../../database/json/PClient';
export interface PinguCommandParams {
    client?: PinguClient;
    message: Message;
    args?: string[];
    pAuthor?: PinguUser;
    pGuildMember?: PinguGuildMember;
    pGuild?: PinguGuild;
    pGuildClient?: PClient;
}
export declare type ExecuteReturns = void | Message | VoiceConnection;
import PinguHandler from './PinguHandler';
export declare class PinguCommand extends PinguHandler {
    constructor(name: string, category: CommandCategoriesType, description: string, data: {
        usage: string;
        guildOnly?: false;
        specificGuildID?: Snowflake;
        examples?: string[];
        permissions: PermissionString[];
        aliases?: string[];
        mustBeBeta?: false;
    }, execute: (params: PinguCommandParams) => Promise<ExecuteReturns>);
    description: string;
    usage: string;
    guildOnly: boolean;
    category: CommandCategoriesType;
    specificGuildID: string;
    examples: string[];
    permissions: PermissionString[];
    aliases: string[];
    mustBeBeta: boolean;
    execute(params: PinguCommandParams): Promise<ExecuteReturns>;
}
export default PinguCommand;
