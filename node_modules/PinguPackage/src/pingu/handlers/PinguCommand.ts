import { Message, PermissionString, Snowflake, VoiceConnection } from 'discord.js';

import { PinguHandler } from './PinguHandler'

import { PClient } from '../../database/json/PClient';

import { errorLog } from "../library/PinguLibrary";
import { PinguUser } from '../user/PinguUser';
import { PinguGuild } from '../guild/PinguGuild';
import { PinguClient } from "../client/PinguClient";
import { PinguGuildMember } from '../guildMember/PinguGuildMember';

export enum CommandCategories { 'Utility', 'Fun', 'Supporting', 'DevOnly', 'GuildSpecific' }
type CommandCategoriesType = keyof typeof CommandCategories;

export interface PinguCommandParams {
    client?: PinguClient,
    message: Message,
    args?: string[],
    pAuthor?: PinguUser,
    pGuild?: PinguGuild,
    pGuildClient?: PClient,
    pGuildMember?: PinguGuildMember
}

type ExecuteReturns = void | Message | VoiceConnection;

export class PinguCommand extends PinguHandler {
    constructor(name: string, category: CommandCategoriesType, description: string, data: {
        usage: string, 
        guildOnly?: false,
        specificGuildID?: Snowflake,
        examples?: string[],
        permissions: PermissionString[],
        aliases?: string[],
    }, 
    execute: (params: PinguCommandParams) => Promise<ExecuteReturns>) 
    { 
        //Must need these
        super(name);
        this.description = description;
        this.category = category;
        if (execute) this.execute = execute;

        if (data) {
            const { permissions } = data;
            this.permissions = permissions && permissions.length ? [...permissions, 'SEND_MESSAGES'] as PermissionString[] : ['SEND_MESSAGES'] as PermissionString[];
            
            //Optional
            const { usage, guildOnly, specificGuildID, examples, aliases } = data;
            this.usage = usage || "";
            this.guildOnly = false;
            this.specificGuildID = specificGuildID;
            this.examples = examples && examples.length ? examples : [""];
            this.aliases = aliases && aliases.length ? aliases : undefined;
        }
    }
    
    public description: string;
    public usage: string;
    public guildOnly = false;
    public category: CommandCategoriesType;
    public specificGuildID: string;
    public examples: string[];
    public permissions: PermissionString[];
    public aliases: string[];
    
    public async execute(params: PinguCommandParams): Promise<ExecuteReturns> {
        return errorLog(params.message.client, `Execute for command **${this.name}**, was not defined!`);
    }
}