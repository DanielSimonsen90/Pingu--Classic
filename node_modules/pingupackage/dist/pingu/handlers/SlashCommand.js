"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const builders_1 = require("@discordjs/builders");
class SlashCommandOption {
    name;
    description;
    required;
    constructor(name, description, required = false) {
        this.name = name;
        this.description = description;
        this.required = required;
    }
}
class SlashCommand extends builders_1.SlashCommandBuilder {
    constructor(data) {
        super();
        const { name, description, defaultPermission, options } = data;
        this.setName(name);
        this.setDescription(description);
        this.setDefaultPermission(defaultPermission ?? true);
    }
}
exports.default = SlashCommand;
const test = new SlashCommand({
    name: 'test',
    description: 'This is a cool test',
    options: []
});
