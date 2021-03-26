import { Message, PermissionString, Snowflake, VoiceConnection } from 'discord.js';
import { PinguHandler } from './PinguHandler';
import { PClient } from '../../database/json/PClient';
import { PinguUser } from '../user/PinguUser';
import { PinguGuild } from '../guild/PinguGuild';
import { PinguClient } from "../client/PinguClient";
export declare enum CommandCategories {
    'Utility' = 0,
    'Fun' = 1,
    'Supporting' = 2,
    'DevOnly' = 3,
    'GuildSpecific' = 4
}
declare type CommandCategoriesType = keyof typeof CommandCategories;
export interface PinguCommandParams {
    client?: PinguClient;
    message: Message;
    args?: string[];
    pAuthor?: PinguUser;
    pGuild?: PinguGuild;
    pGuildClient?: PClient;
}
export declare class PinguCommand extends PinguHandler {
    constructor(name: string, category: CommandCategoriesType, description: string, data: {
        usage: string;
        guildOnly?: false;
        specificGuildID?: Snowflake;
        examples?: string[];
        permissions: PermissionString[];
        aliases?: string[];
    }, execute: (params: PinguCommandParams) => Promise<void | Message | VoiceConnection>);
    description: string;
    usage: string;
    guildOnly: boolean;
    category: CommandCategoriesType;
    specificGuildID: string;
    examples: string[];
    permissions: PermissionString[];
    aliases: string[];
    execute(params: PinguCommandParams): Promise<void | Message | VoiceConnection>;
}
export {};
