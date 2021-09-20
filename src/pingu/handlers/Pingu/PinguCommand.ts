import { Snowflake } from 'discord.js';
import PinguUser from "../../user/PinguUser";
import PinguGuildMember from "../../guildMember/PinguGuildMember";
import PinguGuild from "../../guild/PinguGuild";
import PClient from "../../../database/json/PClient";
import PinguClient from "../../client/PinguClient";
import PinguCommandBase, { 
    BaseCommandData, 
    ClassicCommandParams, 
    ExecuteFunctionProps, 
    ExecuteFunctions, 
    throwInvalidTypeError 
} from '../Command/PinguCommandBase';

interface PItems {
    author: PinguUser,
    member: PinguGuildMember,
    guild: PinguGuild,
    client: PClient
}

export interface CommandParams {
    client?: PinguClient,
    pAuthor?: PinguUser,
    pGuildMember?: PinguGuildMember,
    pGuild?: PinguGuild,
    pGuildClient?: PClient,
    pItems?: PItems
}

import PinguSlashCommandBuilder, { SlashCommandConstructionData, InteractionCommandParams } from '../Command/Slash/PinguSlashCommandBuilder';
export interface PinguClassicCommandParams extends ClassicCommandParams, CommandParams {
    client: PinguClient
}
export interface PinguSlashCommandParams extends InteractionCommandParams, CommandParams {
    client: PinguClient
}

export interface PinguCommandData extends BaseCommandData {
    guildOnly?: boolean;
    specificGuildID?: Snowflake;
    mustBeBeta?: boolean;
    earlySupporterExclusive?: boolean
}

type CommandCategoriesType = 'Utility' | 'Fun' | 'Supporting' | 'DevOnly' | 'GuildSpecific';
export class PinguCommand<ExecutePropsType = {}> extends PinguCommandBase<ExecutePropsType> {
    constructor(name: string, category: CommandCategoriesType, description: string, 
        data: PinguCommandData,
        slashCommandBuilder: SlashCommandConstructionData<PinguClient, ExecutePropsType, CommandParams>,
        executes: ExecuteFunctions<PinguClient, PinguClassicCommandParams, PinguSlashCommandParams, ExecutePropsType>
    ) { 
        super(name, description, data, 
            new PinguSlashCommandBuilder<PinguClient, ExecutePropsType>(name, description, slashCommandBuilder), 
            executes
        );
        this.category = category;

        const { guildOnly, specificGuildID, mustBeBeta } = data;
        this.guildOnly = guildOnly ?? false;
        this.specificGuildID = specificGuildID;
        this.mustBeBeta = mustBeBeta ?? false;

        if (this.specificGuildID && typeof this.specificGuildID != 'string') throwInvalidTypeError<PinguCommandData, 'specificGuildID'>('specificGuildID', name, 'string');
        if (this.guildOnly && typeof this.guildOnly != 'boolean') throwInvalidTypeError<PinguCommandData, 'guildOnly'>('guildOnly', name, 'boolean');
        if (this.mustBeBeta && typeof this.mustBeBeta != 'boolean') throwInvalidTypeError<PinguCommandData, 'mustBeBeta'>('mustBeBeta', name, 'boolean');
    }
    
    public guildOnly = false;
    public category: CommandCategoriesType;
    public specificGuildID: string;
    public mustBeBeta = false;

    protected _execute(client: PinguClient, props: ExecuteFunctionProps, extra?: ExecutePropsType) {
        return this._logError(client, `_execute`);
    }
}

export default PinguCommand;