import { SlashCommandBuilder } from "@discordjs/builders";
import { APIMessage } from "discord-api-types";
import { CommandInteraction, GuildChannel, Message, Role, User } from "discord.js";
import PinguClientBase from "../../../client/PinguClientBase";
import { CommandParamsBase, ExecuteFunctionPublic } from "../PinguCommandBase";
import { PinguSlashCommandGroup } from "./PinguSlashCommandGroup";
import PinguSlashCommandSub, { SubCommandConstructionData, SubCommandExtraOptions } from "./PinguSlashCommandSub";
interface SlashCommandOptions {
    Number: number;
    Integer: number;
    String: string;
    Boolean: boolean;
    Role: Role;
    Channel: GuildChannel;
    User: User;
    default: unknown;
    Mentionable: User | Role;
}
declare type SlashCommandOptionTypes = keyof SlashCommandOptions;
declare type ChoiceTypes = number | string | unknown;
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
interface SlashCommandOptionParams {
}
export declare function SlashCommandOption<T extends SlashCommandOptionTypes = 'default'>(type: T, ...params: SlashCommandOptionParams[T]): SlashCommandOption<T>;
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
