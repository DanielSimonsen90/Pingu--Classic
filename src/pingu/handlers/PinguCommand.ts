export enum CommandCategories { 'Utility', 'Fun', 'Supporting', 'DevOnly', 'GuildSpecific' }
type CommandCategoriesType = keyof typeof CommandCategories;

import PinguClient from "../client/PinguClient";
import Arguments from "../../helpers/Arguments";
import { Message, PermissionString, Snowflake } from 'discord.js';
import PinguUser from '../user/PinguUser';
import PinguGuildMember from '../guildMember/PinguGuildMember';
import PinguGuild from '../guild/PinguGuild';
import PClient from '../../database/json/PClient';

export interface PinguCommandParams {
    client?: PinguClient,
    message: Message,
    args?: Arguments,
    pAuthor?: PinguUser,
    pGuildMember?: PinguGuildMember,
    pGuild?: PinguGuild,
    pGuildClient?: PClient,
}

export type ExecuteReturns = void | Message;

import PinguHandler from './PinguHandler'
export class PinguCommand extends PinguHandler {
    constructor(name: string, category: CommandCategoriesType, description: string, data: {
        usage: string, 
        guildOnly?: false,
        specificGuildID?: Snowflake,
        examples?: string[],
        permissions: PermissionString[],
        aliases?: string[],
        mustBeBeta?: false,
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
            this.permissions = permissions?.length ? [...permissions, 'SEND_MESSAGES'] as PermissionString[] : ['SEND_MESSAGES'] as PermissionString[];
            
            //Optional
            const { usage, guildOnly, specificGuildID, examples, aliases, mustBeBeta } = data;
            this.usage = usage || "";
            this.guildOnly = guildOnly || false;
            this.specificGuildID = specificGuildID;
            this.examples = examples?.length ? examples : [""];
            this.aliases = aliases?.length ? aliases : new Array<string>();
            this.mustBeBeta = mustBeBeta || false;
        }
        else {
            this.usage = "";
            this.guildOnly = false;
            this.examples = [""];
            this.aliases = new Array<string>();
            this.mustBeBeta = false;
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
    public mustBeBeta = false;
    
    public async execute(params: PinguCommandParams): Promise<ExecuteReturns> {
        return params.client.log('error', `Execute for command **${this.name}**, was not defined!`)
    }
}

export default PinguCommand;