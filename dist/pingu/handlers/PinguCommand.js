"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PinguCommand = void 0;
const PinguHandler_1 = require("./PinguHandler");
class PinguCommand extends PinguHandler_1.default {
    constructor(name, category, description, data, execute) {
        //Must need these
        super(name);
        this.description = description;
        this.category = category;
        if (execute)
            this.execute = execute;
        if (data) {
            const { permissions } = data;
            this.permissions = permissions?.length ? [...permissions, 'SEND_MESSAGES'] : ['SEND_MESSAGES'];
            //Optional
            const { usage, guildOnly, specificGuildID, examples, aliases, mustBeBeta } = data;
            this.usage = usage || "";
            this.guildOnly = guildOnly || false;
            this.specificGuildID = specificGuildID;
            this.examples = examples?.length ? examples : [""];
            this.aliases = aliases?.length ? aliases : new Array();
            this.mustBeBeta = mustBeBeta || false;
        }
        else {
            this.usage = "";
            this.guildOnly = false;
            this.examples = [""];
            this.aliases = new Array();
            this.mustBeBeta = false;
        }
        const throwError = function (prop, type) {
            throw new Error(`"${prop}" for ${name} is not typeof ${type}!`);
        };
        if (data) {
            if (this.permissions && !this.permissions.push)
                throwError('permissions', 'array');
            if (this.usage && typeof this.usage != 'string')
                throwError('usage', 'string');
            if (this.specificGuildID && typeof this.specificGuildID != 'string')
                throwError('specificGuildID', 'string');
            if (this.guildOnly && typeof this.guildOnly != 'boolean')
                throwError('guildOnly', 'boolean');
            if (this.mustBeBeta && typeof this.mustBeBeta != 'boolean')
                throwError('mustBeBeta', 'boolean');
            if (this.examples && !this.examples.push)
                throwError('examples', 'array');
            if (this.aliases && !this.aliases.push)
                throwError('aliases', 'array');
        }
    }
    description;
    usage;
    guildOnly = false;
    category;
    specificGuildID;
    examples;
    permissions;
    aliases;
    mustBeBeta = false;
    async execute(params) {
        return params.client.log('error', `Execute for command **${this.name}**, was not defined!`);
    }
}
exports.PinguCommand = PinguCommand;
exports.default = PinguCommand;
