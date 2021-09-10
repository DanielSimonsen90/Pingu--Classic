"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SlashCommand_1 = require("../SlashCommand");
class PinguSlashCommand extends SlashCommand_1.default {
    constructor(name, description, options, extra, onInteraction) {
        super(name, description, options, extra);
        const { specificGuildId, mustBeBeta } = extra;
        this.specificGuildId = specificGuildId;
        this.mustBeBeta = mustBeBeta ?? false;
        if (onInteraction)
            this.onInteraction = onInteraction;
    }
    specificGuildId;
    mustBeBeta;
    onInteraction(client, params, interaction) {
        client.log('error', `Interaction for ${this.name} is not implemented!`);
        return null;
    }
}
exports.default = PinguSlashCommand;
