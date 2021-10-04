import PinguUser from "../../user/PinguUser";
import PinguGuildMember from "../../guildMember/PinguGuildMember";
import PinguGuild from "../../guild/PinguGuild";
import PClient from "../../../database/json/PClient";
import PinguClient from "../../client/PinguClient";
import PinguCommandBase, { BaseCommandData, ClassicCommandParams, ExecuteFunctionProps, ExecuteFunctions, ReplyReturn } from '../Command/PinguCommandBase';
export interface PItems {
    pAuthor: PinguUser;
    pGuildMember: PinguGuildMember;
    pGuild: PinguGuild;
    pGuildClient: PClient;
}
export interface CommandParams {
    client?: PinguClient;
    pAuthor?: PinguUser;
    pGuildMember?: PinguGuildMember;
    pGuild?: PinguGuild;
    pGuildClient?: PClient;
    pItems?: PItems;
}
import { SlashCommandConstructionData, InteractionCommandParams } from '../Command/Slash/PinguSlashCommandBuilder';
export interface PinguClassicCommandParams extends ClassicCommandParams, CommandParams {
    client: PinguClient;
}
export interface PinguSlashCommandParams extends InteractionCommandParams, CommandParams {
    client: PinguClient;
}
export interface PinguCommandData extends BaseCommandData {
    mustBeBeta?: boolean;
    earlySupporterExclusive?: boolean;
}
declare type CommandCategoriesType = 'Utility' | 'Fun' | 'Support' | 'DevOnly' | 'GuildSpecific';
export declare class PinguCommand<ExecutePropsType = {}> extends PinguCommandBase<ExecutePropsType, PinguClassicCommandParams, PinguSlashCommandParams> {
    constructor(name: string, category: CommandCategoriesType, description: string, data: PinguCommandData, slashCommandBuilder: SlashCommandConstructionData<PinguClient, ExecutePropsType, CommandParams>, executes: ExecuteFunctions<PinguClient, PinguClassicCommandParams, PinguSlashCommandParams, ExecutePropsType>);
    category: CommandCategoriesType;
    mustBeBeta: boolean;
    protected _execute(client: PinguClient, props: ExecuteFunctionProps, extra?: ExecutePropsType): ReplyReturn;
}
export default PinguCommand;
