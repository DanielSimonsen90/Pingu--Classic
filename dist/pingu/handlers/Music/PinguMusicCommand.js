"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PinguMusicCommand = void 0;
const PinguHandler_1 = require("../PinguHandler");
class PinguMusicCommand extends PinguHandler_1.default {
    constructor(name, description, data, execute) {
        super(name);
        this.description = description;
        if (execute)
            this.execute = execute;
        const { usage, examples, permissions, aliases, queueRequired } = data;
        this.permissions = permissions ?? [];
        this.usage = usage ?? "";
        this.examples = examples?.length ? examples : [""];
        this.aliases = aliases?.length && aliases;
        this.queueRequired = queueRequired ?? false;
    }
    description;
    usage;
    examples;
    aliases;
    permissions;
    queueRequired = false;
    execute(params) {
        return params.client.log('error', `Execute for command **${this.name}**, was not defined!`);
    }
}
exports.PinguMusicCommand = PinguMusicCommand;
exports.default = PinguMusicCommand;
