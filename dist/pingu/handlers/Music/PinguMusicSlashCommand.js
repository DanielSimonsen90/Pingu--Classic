"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const PinguSlashCommandBuilderBase_1 = require("../PinguSlashCommandBuilderBase");
class PinguMusicSlashCommandBuilder extends PinguSlashCommandBuilderBase_1.default {
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
exports.default = PinguMusicSlashCommandBuilder;
