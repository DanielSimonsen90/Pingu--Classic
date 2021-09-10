"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SlashCommand_1 = require("../SlashCommand");
class PinguMusicSlashCommand extends SlashCommand_1.default {
    constructor(name, description, options, extra, onInteraction) {
        super(name, description, options, extra);
        const { queueRequired } = extra;
        this.queueRequired = queueRequired ?? false;
        if (onInteraction)
            this.onInteraction = onInteraction;
    }
    queueRequired;
    onInteraction(client, params, interaction) {
        client.log('error', `Interaction for ${this.name} is not implemented!`);
        return null;
    }
}
exports.default = PinguMusicSlashCommand;
