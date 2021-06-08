"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PinguMusicCommand = void 0;
const PinguCommand_1 = require("./PinguCommand");
const PinguLibrary_1 = require("../library/PinguLibrary");
class PinguMusicCommand extends PinguCommand_1.PinguCommand {
    constructor(name, description, data, execute) {
        super(name, 'Fun', description, data, execute);
        this.queueRequired = false;
        this.queueRequired = data.queueRequired;
    }
    execute(params) {
        return PinguLibrary_1.errorLog(params.message.client, `Execute for command **${this.name}**, was not defined!`);
    }
}
exports.PinguMusicCommand = PinguMusicCommand;
