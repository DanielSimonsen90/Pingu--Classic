"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const PinguSlashCommandBuilderBase_1 = require("../Command/Slash/PinguSlashCommandBuilderBase");
class PinguSlashCommandBuilder extends PinguSlashCommandBuilderBase_1.default {
    constructor(name, description, options, extra, onInteraction) {
        super(name, description, options, extra);
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
exports.default = PinguSlashCommandBuilder;
