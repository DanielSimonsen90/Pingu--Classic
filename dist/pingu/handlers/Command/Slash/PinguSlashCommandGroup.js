"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PinguSlashCommandGroup = void 0;
const builders_1 = require("@discordjs/builders");
class PinguSlashCommandGroup extends builders_1.SlashCommandSubcommandGroupBuilder {
    constructor(name, description, subCommands) {
        super();
        this.setName(name);
        this.setDescription(description);
        subCommands.forEach(scmd => this.addSubcommand(() => scmd));
    }
}
exports.PinguSlashCommandGroup = PinguSlashCommandGroup;
