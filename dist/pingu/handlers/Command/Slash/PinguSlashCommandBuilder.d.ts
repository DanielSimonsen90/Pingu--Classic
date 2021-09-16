import { SlashCommandBuilder } from "@discordjs/builders";
import { APIMessage } from "discord-api-types";
import { CommandInteraction, Message } from "discord.js";
import PinguClientBase from "../../../client/PinguClientBase";
import { CommandParamsBase, ExecuteFunctionPublic } from "../PinguCommandBase";
import { PinguSlashCommandGroup } from "./PinguSlashCommandGroup";
import PinguSlashCommandSub, { SubCommandConstructionData, SubCommandExtraOptions } from "./PinguSlashCommandSub";
declare type SlashCommandOptionTypes = 'Number' | 'Integer' | 'String' | 'Boolean' | 'Role' | 'Channel' | 'User' | 'default' | 'Mentionable';
declare type ChoiceTypes = number | string | any;
interface Choice<CT extends ChoiceTypes> {
    name: string;
    value: CT;
}
export interface SlashCommandOption<CT extends ChoiceTypes = any> {
    name: string;
    description: string;
    required: boolean;
    choices: Choice<CT>[];
    type: SlashCommandOptionTypes;
}
declare type DefaultChoiceParams = [name: string, description: string, required?: boolean];
declare type ChocieOptionParams<T extends ChoiceTypes> = [name: string, description: string, options?: {
    choices?: Choice<T>[];
    required?: boolean;
}];
interface SlashCommandOptionParams {
    default: DefaultChoiceParams;
    Boolean: DefaultChoiceParams;
    Mentionable: DefaultChoiceParams;
    Role: DefaultChoiceParams;
    Channel: DefaultChoiceParams;
    User: DefaultChoiceParams;
    Number: ChocieOptionParams<number>;
    String: ChocieOptionParams<string>;
    Integer: ChocieOptionParams<number>;
}
export declare function SlashCommandOption<T extends SlashCommandOptionTypes = 'default'>(type: T, ...params: SlashCommandOptionParams[T]): SlashCommandOption;
export interface SlashCommandsExtraOptions extends SubCommandExtraOptions {
    defaultPermission?: boolean;
}
export interface InteractionCommandParams<Client = PinguClientBase> extends CommandParamsBase<Client> {
    interaction: CommandInteraction;
}
export interface SlashCommandConstructionData<Client extends PinguClientBase = PinguClientBase, ExecutePropsType = {}, AdditionalParams = {}> extends SubCommandConstructionData<Client, ExecutePropsType, AdditionalParams> {
    extra?: SlashCommandsExtraOptions;
    subCommands?: PinguSlashCommandSub<Client, ExecutePropsType, AdditionalParams>[];
    subCommandGroups?: PinguSlashCommandGroup[];
}
export declare class PinguSlashCommandBuilder<Client extends PinguClientBase = PinguClientBase, AdditionalParams = {}, ExecutePropsType = {}> extends SlashCommandBuilder {
    constructor(name: string, description: string, data: SlashCommandConstructionData<Client, ExecutePropsType, AdditionalParams>);
    path: string;
    subCommandGroups: Array<PinguSlashCommandGroup>;
    subCommands: Array<PinguSlashCommandSub>;
    onInteraction(params: InteractionCommandParams<Client>, execute: ExecuteFunctionPublic<ExecutePropsType>): Promise<Message | APIMessage>;
}
export { SlashCommandOption as Option, SlashCommandsExtraOptions as ExtraOptions };
export default PinguSlashCommandBuilder;