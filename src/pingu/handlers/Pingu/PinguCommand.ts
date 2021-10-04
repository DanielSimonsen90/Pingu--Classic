import { Snowflake } from 'discord.js';
import PinguUser from "../../user/PinguUser";
import PinguGuildMember from "../../guildMember/PinguGuildMember";
import PinguGuild from "../../guild/PinguGuild";
import PClient from "../../../database/json/PClient";
import PinguClient from "../../client/PinguClient";
import PinguCommandBase, { 
    BaseCommandData, ClassicCommandParams, 
    ExecuteFunctionProps, ExecuteFunctions, 
    ReplyReturn, throwInvalidTypeError 
} from '../Command/PinguCommandBase';

export interface PItems {
    pAuthor: PinguUser,
    pGuildMember: PinguGuildMember,
    pGuild: PinguGuild,
    pGuildClient: PClient
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
    mustBeBeta?: boolean;
    earlySupporterExclusive?: boolean
}

type CommandCategoriesType = 'Utility' | 'Fun' | 'Support' | 'DevOnly' | 'GuildSpecific';
export class PinguCommand<ExecutePropsType = {}> extends PinguCommandBase<ExecutePropsType, PinguClassicCommandParams, PinguSlashCommandParams> {
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

        const { mustBeBeta } = data;
        this.mustBeBeta = mustBeBeta ?? false;
        if (this.mustBeBeta && typeof this.mustBeBeta != 'boolean') throwInvalidTypeError<PinguCommandData, 'mustBeBeta'>('mustBeBeta', name, 'boolean');
    }
    
    public category: CommandCategoriesType;
    public mustBeBeta = false;

    protected _execute(client: PinguClient, props: ExecuteFunctionProps, extra?: ExecutePropsType): ReplyReturn {
        return this._logError(client, `_execute`);
    }
}

export default PinguCommand;