import { SlashCommandBuilder } from "@discordjs/builders";
import { APIMessage } from "discord-api-types";
import { CommandInteraction, GuildChannel, Message, Role, User } from "discord.js";
import PinguClientBase from "../../../client/PinguClientBase";
import { CommandParamsBase, ExecuteFunctionPublic } from "../PinguCommandBase";
import { PinguSlashCommandGroup } from "./PinguSlashCommandGroup";
import PinguSlashCommandSub, { SubCommandConstructionData, SubCommandExtraOptions } from "./PinguSlashCommandSub";

interface SlashCommandOptions {
    Number: number,
    Integer: number,
    String: string,
    Boolean: boolean,
    Role: Role,
    Channel: GuildChannel,
    User: User,
    default: unknown,
    Mentionable: User | Role
}
type SlashCommandOptionTypes = keyof SlashCommandOptions;
type ChoiceTypes = number | string | unknown;

interface Choice<CT extends ChoiceTypes> { name: string; value: CT; }
export interface SlashCommandOption<CT extends ChoiceTypes = any> {
    name: string;
    description: string;
    required: boolean;
    choices: Choice<CT>[];
    type: SlashCommandOptionTypes
}

type DefaultChoiceParams = [name: string, description: string, required?: boolean];
type ChocieOptionParams<T extends ChoiceTypes> = [name: string, description: string, options?: { choices?: Choice<T>[], required?: boolean }]

interface SlashCommandOptionParamsChoices {
    Number: ChocieOptionParams<number>;
    String: ChocieOptionParams<string>;
    Integer: ChocieOptionParams<number>;
}
interface SlashCommandOptionParams extends SlashCommandOptionParamsChoices {
    default: DefaultChoiceParams;
    Boolean: DefaultChoiceParams;
    Mentionable: DefaultChoiceParams;
    Role: DefaultChoiceParams;
    Channel: DefaultChoiceParams;
    User: DefaultChoiceParams;
}

export function SlashCommandOption<T extends SlashCommandOptionTypes = 'default'>(type: T, ...params: SlashCommandOptionParams[T]) {
    const [name, description] = params;
    const required = typeof params[2] == 'boolean' ? params[2] : params[2].required;
    const choices = typeof params[2] == 'boolean' ? null : params[2].choices;

    return { name, description, required, choices, type }
}

export interface SlashCommandsExtraOptions extends SubCommandExtraOptions {
    defaultPermission?: boolean
}

export interface InteractionCommandParams<Client = PinguClientBase> extends CommandParamsBase<Client> {
    interaction: CommandInteraction
}
export interface SlashCommandConstructionData<
    Client extends PinguClientBase = PinguClientBase, 
    ExecutePropsType = {},
    AdditionalParams = {}
> extends SubCommandConstructionData<Client, ExecutePropsType, AdditionalParams> {
    extra?: SlashCommandsExtraOptions,
    subCommands?: PinguSlashCommandSub<Client, ExecutePropsType, AdditionalParams>[],
    subCommandGroups?: PinguSlashCommandGroup[],
}


export class PinguSlashCommandBuilder<
    Client extends PinguClientBase = PinguClientBase,
    AdditionalParams = {},
    ExecutePropsType = {}
> extends SlashCommandBuilder {
    constructor(name: string, description: string, data: SlashCommandConstructionData<Client, ExecutePropsType, AdditionalParams>) {
        super();

        const options = data.options ?? [];
        const extra = data.extra ?? { allowPrivate: true, defaultPermission: true };
        const subCommandGroups = data.subCommandGroups ?? [];
        const subCommands = data.subCommands ?? [];

        const { allowPrivate, defaultPermission } = extra;

        this.setName(name)
        this.setDescription(description)
        this.setDefaultPermission(defaultPermission ?? true)

        if (allowPrivate ?? true) options.push(SlashCommandOption('Boolean', 'private', 'Send response privately'));

        options.forEach(({ name, description, required, choices, type }) => 
        this[`add${type}Option`](o => o
            .setName(name)
            .setDescription(description)
            .setRequired(required)
            .addChoices?.(...choices)
        ));

        this.subCommandGroups = subCommandGroups;
        this.subCommands = subCommands;

        subCommandGroups.forEach(group => this.addSubcommandGroup(() => group));
        subCommands.forEach(scmd => this.addSubcommand(() => scmd));
    }

    public path: string;
    public subCommandGroups: Array<PinguSlashCommandGroup>;
    public subCommands: Array<PinguSlashCommandSub>;

    public onInteraction(params: InteractionCommandParams<Client>, execute: ExecuteFunctionPublic<ExecutePropsType>): Promise<Message | APIMessage> {
        return params.client.log('error', `onInteraction not defined for ${this.name}`);
    }
}

export {
    SlashCommandOption as Option,
    SlashCommandsExtraOptions as ExtraOptions
}
export default PinguSlashCommandBuilder