"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
class SlashCommandCollection {
    constructor(client, entries) {
        this._client = client;
        this._inner = new discord_js_1.Collection(entries);
    }
    _client;
    _inner;
    get _clientCommands() {
        return this._client.application.commands;
    }
    _set(name, command) {
        this._inner.set(name, command);
        return this;
    }
    get(name) {
        return this._inner.get(name);
    }
    async post(name, command) {
        await this._clientCommands.create(command);
        return this._set(name, command);
    }
    async put(name, update) {
        await this._clientCommands.edit(this.get(name), update);
        return this._set(name, update);
    }
    async delete(name) {
        await this._clientCommands.delete(this.get(name));
        this._inner.delete(name);
        return this;
    }
}
exports.default = SlashCommandCollection;
