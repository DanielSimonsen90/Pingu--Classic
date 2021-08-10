"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PinguMusicCommand = void 0;
const PinguHandler_1 = require("./PinguHandler");
class PinguMusicCommand extends PinguHandler_1.default {
    constructor(name, description, data, execute) {
        super(name);
        this.queueRequired = false;
        this.description = description;
        if (execute)
            this.execute = execute;
        const { usage, examples, permissions, aliases, queueRequired } = data;
        this.usage = usage || "";
        this.examples = (examples === null || examples === void 0 ? void 0 : examples.length) ? examples : [""];
        this.aliases = (aliases === null || aliases === void 0 ? void 0 : aliases.length) && aliases;
        this.queueRequired = queueRequired || false;
    }
    execute(params) {
        return params.client.log('error', `Execute for command **${this.name}**, was not defined!`);
    }
}
exports.PinguMusicCommand = PinguMusicCommand;
exports.default = PinguMusicCommand;
