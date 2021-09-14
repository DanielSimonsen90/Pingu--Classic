"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const PinguSlashCommandBuilderBase_1 = require("../Command/Slash/PinguSlashCommandBuilderBase");
class PinguMusicSlashCommandBuilder extends PinguSlashCommandBuilderBase_1.default {
    constructor(name, description, options, extra) {
        super(name, description, options, extra);
    }
    queueRequired;
}
exports.default = PinguMusicSlashCommandBuilder;
