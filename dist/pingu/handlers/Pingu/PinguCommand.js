"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PinguCommand = void 0;
const PinguCommandBase_1 = require("../Command/PinguCommandBase");
const PinguSlashCommandBuilder_1 = require("../Command/Slash/PinguSlashCommandBuilder");
class PinguCommand extends PinguCommandBase_1.default {
    constructor(name, category, description, data, slashCommandBuilder, executes) {
        super(name, description, data, new PinguSlashCommandBuilder_1.default(name, description, slashCommandBuilder), executes);
        this.category = category;
        const { guildOnly, specificGuildId: specificGuildID, mustBeBeta } = data;
        this.guildOnly = guildOnly ?? false;
        this.specificGuildID = specificGuildID;
        this.mustBeBeta = mustBeBeta ?? false;
        if (this.specificGuildID && typeof this.specificGuildID != 'string')
            PinguCommandBase_1.throwInvalidTypeError('specificGuildID', name, 'string');
        if (this.guildOnly && typeof this.guildOnly != 'boolean')
            PinguCommandBase_1.throwInvalidTypeError('guildOnly', name, 'boolean');
        if (this.mustBeBeta && typeof this.mustBeBeta != 'boolean')
            PinguCommandBase_1.throwInvalidTypeError('mustBeBeta', name, 'boolean');
    }
    guildOnly = false;
    category;
    specificGuildID;
    mustBeBeta = false;
    _execute(client, props, extra) {
        return this._logError(client, `_execute`);
    }
}
exports.PinguCommand = PinguCommand;
exports.default = PinguCommand;
