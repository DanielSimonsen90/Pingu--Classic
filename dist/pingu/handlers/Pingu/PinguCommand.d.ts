import { Snowflake } from 'discord.js';
import PinguUser from "../../user/PinguUser";
import PinguGuildMember from "../../guildMember/PinguGuildMember";
import PinguGuild from "../../guild/PinguGuild";
import PClient from "../../../database/json/PClient";
import PinguClient from "../../client/PinguClient";
import PinguCommandBase, { BaseCommandData, ClassicCommandParams, ExecuteFunctionProps, ExecuteFunctions } from '../Command/PinguCommandBase';
interface PItems {
    author: PinguUser;
    member: PinguGuildMember;
    guild: PinguGuild;
    client: PClient;
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
    guildOnly?: boolean;
    specificGuildID?: Snowflake;
    mustBeBeta?: boolean;
}
declare type CommandCategoriesType = 'Utility' | 'Fun' | 'Supporting' | 'DevOnly' | 'GuildSpecific';
export declare class PinguCommand<ExecutePropsType = {}> extends PinguCommandBase<ExecutePropsType> {
    constructor(name: string, category: CommandCategoriesType, description: string, data: PinguCommandData, slashCommandBuilder: SlashCommandConstructionData<PinguClient, ExecutePropsType, CommandParams>, executes: ExecuteFunctions<PinguClient, PinguClassicCommandParams, PinguSlashCommandParams, ExecutePropsType>);
    guildOnly: boolean;
    category: CommandCategoriesType;
    specificGuildID: string;
    mustBeBeta: boolean;
    protected _execute(client: PinguClient, props: ExecuteFunctionProps, extra?: ExecutePropsType): Promise<import("discord.js").Message>;
}
export default PinguCommand;
