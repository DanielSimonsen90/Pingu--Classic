"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PinguActionRow = void 0;
const discord_js_1 = require("discord.js");
class PinguActionRow extends discord_js_1.MessageActionRow {
    name;
    constructor(name, ...components) {
        super({ components });
        this.name = name;
    }
    get(type, id) {
        return this.components.find(c => c.customId == id);
    }
}
exports.PinguActionRow = PinguActionRow;
exports.default = PinguActionRow;
