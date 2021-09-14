"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PinguMusicCommand = void 0;
const PinguCommandBase_1 = require("../Command/PinguCommandBase");
const PinguSlashCommandBuilder_1 = require("../Command/Slash/PinguSlashCommandBuilder");
class PinguMusicCommand extends PinguCommandBase_1.default {
    constructor(name, description, data, slashCommandBuilder, executes) {
        super(name, description, data, new PinguSlashCommandBuilder_1.default(name, description, slashCommandBuilder), executes);
        const { queueRequired } = data;
        this.queueRequired = queueRequired ?? false;
    }
    queueRequired = false;
}
exports.PinguMusicCommand = PinguMusicCommand;
exports.default = PinguMusicCommand;
