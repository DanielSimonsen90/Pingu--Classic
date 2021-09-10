import { SlashCommandBuilder } from "@discordjs/builders";
import { PermissionString } from "discord.js";

type SlashCommandOptionTypes = 'Number' | 'Integer' | 'String' | 'Boolean' | 'Role' | 'Channel' | 'User' | 'default' | 'Mentionable';
type ChoiceTypes = number | string | any;

interface Choice<CT extends ChoiceTypes> { name: string; value: CT; }
interface SlashCommandOption<CT extends ChoiceTypes = any> {
    name: string;
    description: string;
    required: boolean;
    choices: Choice<CT>[];
    type: SlashCommandOptionTypes
}

type DefaultChoiceParams = [name: string, description: string, required?: boolean];
type ChocieOptionParams<T extends ChoiceTypes> = [name: string, description: string, options?: { choices?: Choice<T>[], required?: boolean }]

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

function SlashCommandOption<T extends SlashCommandOptionTypes = 'default'>(type: T, ...params: SlashCommandOptionParams[T]): SlashCommandOption {
    const [name, description] = params;
    const required = typeof params[2] == 'boolean' ? params[2] : params[2].required;
    const choices = typeof params[2] == 'boolean' ? null : params[2].choices;

    return { name, description, required, choices, type }
}

interface SlashCommandsExtraOptions {
    defaultPermission?: boolean,
    allowPrivate?: boolean,
    permissions?: PermissionString[]
}
export default abstract class SlashCommand extends SlashCommandBuilder {
    constructor(name: string, description: string, options: SlashCommandOption[] = [], extra: SlashCommandsExtraOptions) {
        super();
        const { allowPrivate, defaultPermission, permissions } = extra;
        this.requiredPermissions = permissions ?? [];

        this.setName(name)
        this.setDescription(description)
        this.setDefaultPermission(defaultPermission ?? true)

        if (allowPrivate ?? true) options.push(SlashCommandOption('Boolean', 'private', 'Send response privately'));

        options.forEach(({ name, description, required, choices, type }) => 
        this[`add${type}Option`](o => o
            .setName(name)
            .setDescription(description)
            .setRequired(required)
            .addChoices(...choices)
        ));
    }

    public requiredPermissions: PermissionString[];
}

export {
    SlashCommandOption as Option,
    SlashCommandsExtraOptions as ExtraOptions
}