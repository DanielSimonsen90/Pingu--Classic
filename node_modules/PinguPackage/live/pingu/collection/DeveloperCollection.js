"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeveloperCollection = exports.developers = void 0;
const discord_js_1 = require("discord.js");
exports.developers = new discord_js_1.Collection([
    ['Danho', '245572699894710272'],
    ['SynthySytro', '405331883157880846'],
    ['Slothman', '290131910091603968']
]);
class DeveloperCollection extends discord_js_1.Collection {
    isPinguDev(user) {
        return this.get(exports.developers.findKey(id => id == user.id)) != null;
    }
    update(user) {
        if (!this.some(u => u.id == user.id))
            return this;
        const name = this.findKey(u => u.id == user.id);
        return this.set(name, user);
    }
}
exports.DeveloperCollection = DeveloperCollection;
exports.default = DeveloperCollection;
