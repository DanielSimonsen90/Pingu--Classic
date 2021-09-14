"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PinguSlashCommandSub = void 0;
const builders_1 = require("@discordjs/builders");
const PinguSlashCommandBuilder_1 = require("./PinguSlashCommandBuilder");
class PinguSlashCommandSub extends builders_1.SlashCommandSubcommandBuilder {
    constructor(name, description, data) {
        super();
        const options = data.options ?? [];
        const extra = data.extra ?? { allowPrivate: true };
        const { allowPrivate } = extra;
        this.setName(name);
        this.setDescription(description);
        if (allowPrivate ?? true)
            options.push(PinguSlashCommandBuilder_1.SlashCommandOption('Boolean', 'private', 'Send response privately'));
        options.forEach(({ name, description, required, choices, type }) => this[`add${type}Option`](o => o
            .setName(name)
            .setDescription(description)
            .setRequired(required)
            .addChoices?.(...choices)));
    }
    onInteraction(params, execute) {
        return params.client.log('error', `onInteraction not defined for ${this.name}`);
    }
}
exports.PinguSlashCommandSub = PinguSlashCommandSub;
exports.default = PinguSlashCommandSub;
