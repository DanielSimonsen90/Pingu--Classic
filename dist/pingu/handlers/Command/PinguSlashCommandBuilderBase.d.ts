import { SlashCommandBuilder } from "@discordjs/builders";
import { PermissionString } from "discord.js";
declare type SlashCommandOptionTypes = 'Number' | 'Integer' | 'String' | 'Boolean' | 'Role' | 'Channel' | 'User' | 'default' | 'Mentionable';
declare type ChoiceTypes = number | string | any;
interface Choice<CT extends ChoiceTypes> {
    name: string;
    value: CT;
}
interface SlashCommandOption<CT extends ChoiceTypes = any> {
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
declare function SlashCommandOption<T extends SlashCommandOptionTypes = 'default'>(type: T, ...params: SlashCommandOptionParams[T]): SlashCommandOption;
interface SlashCommandsExtraOptions {
    defaultPermission?: boolean;
    allowPrivate?: boolean;
    permissions?: PermissionString[];
}
export default abstract class PinguSlashCommandBuilderBase extends SlashCommandBuilder {
    constructor(name: string, description: string, options: SlashCommandOption[], extra: SlashCommandsExtraOptions);
    requiredPermissions: PermissionString[];
    path: string;
}
export { SlashCommandOption as Option, SlashCommandsExtraOptions as ExtraOptions };
