"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Option = void 0;
const builders_1 = require("@discordjs/builders");
function SlashCommandOption(type, ...params) {
    const [name, description] = params;
    const required = typeof params[2] == 'boolean' ? params[2] : params[2].required;
    const choices = typeof params[2] == 'boolean' ? null : params[2].choices;
    return { name, description, required, choices, type };
}
exports.Option = SlashCommandOption;
class SlashCommand extends builders_1.SlashCommandBuilder {
    constructor(name, description, options = [], extra) {
        super();
        const { allowPrivate, defaultPermission, permissions } = extra;
        this.requiredPermissions = permissions ?? [];
        this.setName(name);
        this.setDescription(description);
        this.setDefaultPermission(defaultPermission ?? true);
        if (allowPrivate ?? true)
            options.push(SlashCommandOption('Boolean', 'private', 'Send response privately'));
        options.forEach(({ name, description, required, choices, type }) => this[`add${type}Option`](o => o
            .setName(name)
            .setDescription(description)
            .setRequired(required)
            .addChoices(...choices)));
    }
    requiredPermissions;
}
exports.default = SlashCommand;
