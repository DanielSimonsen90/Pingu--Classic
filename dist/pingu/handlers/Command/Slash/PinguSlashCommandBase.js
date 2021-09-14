"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PinguSlashCommandBase = void 0;
const discord_js_1 = require("discord.js");
class PinguSlashCommandBase extends discord_js_1.ApplicationCommand {
    constructor(application) {
        super(application.client, {
            name: application.name,
            description: application.description,
            id: application.id,
            application_id: application.applicationId,
        }, application.guild, application.guildId);
    }
    path;
}
exports.PinguSlashCommandBase = PinguSlashCommandBase;
exports.default = PinguSlashCommandBase;
