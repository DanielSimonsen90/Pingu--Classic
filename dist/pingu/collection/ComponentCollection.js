"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComponentCollection = void 0;
const discord_js_1 = require("discord.js");
class ComponentCollection extends discord_js_1.MessageActionRow {
    get(id) {
        return this.components.find(c => c.customId == id);
    }
}
exports.ComponentCollection = ComponentCollection;
