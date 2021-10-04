"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PinguCommand = void 0;
const PinguCommandBase_1 = require("../Command/PinguCommandBase");
const PinguSlashCommandBuilder_1 = require("../Command/Slash/PinguSlashCommandBuilder");
class PinguCommand extends PinguCommandBase_1.default {
    constructor(name, category, description, data, slashCommandBuilder, executes) {
        super(name, description, data, new PinguSlashCommandBuilder_1.default(name, description, slashCommandBuilder), executes);
        this.category = category;
        const { mustBeBeta } = data;
        this.mustBeBeta = mustBeBeta ?? false;
        if (this.mustBeBeta && typeof this.mustBeBeta != 'boolean')
            (0, PinguCommandBase_1.throwInvalidTypeError)('mustBeBeta', name, 'boolean');
    }
    category;
    mustBeBeta = false;
    _execute(client, props, extra) {
        return this._logError(client, `_execute`);
    }
}
exports.PinguCommand = PinguCommand;
exports.default = PinguCommand;
