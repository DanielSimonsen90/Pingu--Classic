"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Option = exports.PinguSlashCommandBuilder = exports.SlashCommandOption = void 0;
const builders_1 = require("@discordjs/builders");
function SlashCommandOption(type, ...params) {
    const [name, description] = params;
    const required = params[2] ? typeof params[2] == 'boolean' ? params[2] : params[2].required : false;
    const choices = params[2] ? typeof params[2] == 'boolean' ? null : params[2].choices : [];
    if (/( +)|([A-Z])/g.test(name)) {
        throw new Error(`"${name}" is an invalid string. Name must not contain spaces or upper-cased letters.`);
    }
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
        options.forEach(({ name, description, required, choices, type }) => (this[`add${type}Option`](builder => {
            let result = builder
                .setName(name)
                .setDescription(description)
                .setRequired(required);
            if (builder.addChoices)
                result = builder.addChoices(...choices);
            return result;
        })));
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
