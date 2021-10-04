"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rest_1 = require("@discordjs/rest");
const v9_1 = require("discord-api-types/v9");
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
    async postAll(client, commands) {
        if (!client.isReady())
            throw new Error(`Client is not ready yet!`);
        const json = commands.reduce((result, cmd) => {
            if (cmd.specificGuildId) {
                result.guildSpecific.push({
                    ...cmd.builder.toJSON(),
                    id: cmd.specificGuildId
                });
            }
            else
                result[cmd.guildOnly ?
                    'guildOnly' :
                    'all'].push(cmd.builder.toJSON());
            return result;
        }, { all: new Array(),
            guildOnly: new Array(),
            guildSpecific: new Array()
        });
        if (client.config.testingMode) {
            return this.postTo(client.savedServers.get('Pingu Emotes'), ...json.all);
        }
        const cmds = await Promise.all([
            this.post(...json.all),
            ...this._client.guilds.cache.map(g => this.postTo(g, ...json.guildOnly)),
            ...json.guildSpecific.map(cmd => this.postTo(cmd.id, cmd))
        ]);
    }
    async post(...data) {
        return this._post(data);
    }
    async postTo(guildData, ...data) {
        return this._post(data, guildData);
    }
    async _post(data, guildData) {
        const rest = new rest_1.REST({ version: '9' }).setToken(this._client.token);
        const guild = typeof guildData == 'string' ? this._client.guilds.cache.get(guildData) : (guildData['guild'] || guildData);
        const cmds = await rest.put(v9_1.Routes[guild ?
            'applicationGuildCommands' :
            'applicationCommands'](this._client.id, guild.id), { body: data });
        this._client.log('console', `Posted ${data.length} Slashcommands${guild ? ` to ${guild}` : ''}.`);
        console.log(cmds);
        return this;
        // return this._set(cmd.name, cmd);
    }
    async put(data) {
        const cmd = await this._clientCommands.edit(this.get(data.name), data);
        return this._set(cmd.name, cmd);
    }
    async delete(name) {
        await this._clientCommands.delete(this.get(name));
        this._inner.delete(name);
        return this;
    }
}
exports.default = SlashCommandCollection;
