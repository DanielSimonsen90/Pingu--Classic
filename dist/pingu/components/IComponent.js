"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Component = void 0;
const discord_js_1 = require("discord.js");
const ButtonComponent_1 = require("./ButtonComponent");
function ComponentConstruct(type, data) {
    return (() => {
        switch (type) {
            case 'Button': return new ButtonComponent_1.default(data);
            case 'SelectMenu': return new discord_js_1.MessageSelectMenu(data);
            default: return null;
        }
    })();
}
exports.Component = ComponentConstruct;
