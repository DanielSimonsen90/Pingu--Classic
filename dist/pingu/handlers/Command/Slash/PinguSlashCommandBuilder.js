"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Option = exports.PinguSlashCommandBuilder = exports.SlashCommandOption = void 0;
const builders_1 = require("@discordjs/builders");
function SlashCommandOption(type, ...params) {
    const [name, description] = params;
    const required = typeof params[2] == 'boolean' ? params[2] : params[2].required;
    const choices = typeof params[2] == 'boolean' ? null : params[2].choices;
    return { name, description, required, choices, type };
}
exports.SlashCommandOption = SlashCommandOption;
exports.Option = SlashCommandOption;
class PinguSlashCommandBuilder extends builders_1.SlashCommandBuilder {
    constructor(name, description, data) {
        super();
        const options = data.options ?? [];
        const extra = data.extra ?? { allowPrivate: true, defaultPermission: true };
        const subCommandGroups = data.subCommandGroups ?? [];
        const subCommands = data.subCommands ?? [];
        const { allowPrivate, defaultPermission } = extra;
        this.setName(name);
        this.setDescription(description);
        this.setDefaultPermission(defaultPermission ?? true);
        if (allowPrivate ?? true)
            options.push(SlashCommandOption('Boolean', 'private', 'Send response privately'));
        options.forEach(({ name, description, required, choices, type }) => this[`add${type}Option`](o => o
            .setName(name)
            .setDescription(description)
            .setRequired(required)
            .addChoices?.(...choices)));
        this.subCommandGroups = subCommandGroups;
        this.subCommands = subCommands;
        subCommandGroups.forEach(group => this.addSubcommandGroup(() => group));
        subCommands.forEach(scmd => this.addSubcommand(() => scmd));
    }
    path;
    subCommandGroups;
    subCommands;
    onInteraction(params, execute) {
        return params.client.log('error', `onInteraction not defined for ${this.name}`);
    }
}
exports.PinguSlashCommandBuilder = PinguSlashCommandBuilder;
exports.default = PinguSlashCommandBuilder;
