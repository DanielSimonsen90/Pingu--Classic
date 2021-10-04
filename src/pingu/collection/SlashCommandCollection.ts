import { REST } from "@discordjs/rest";
import { Routes } from 'discord-api-types/v9';
import { Collection, ApplicationCommand, ApplicationCommandData, Guild, Snowflake, GuildResolvable } from "discord.js";
import PinguClientBase from "../client/PinguClientBase";
import PinguCommandBase from "../handlers/Command/PinguCommandBase";
import { SlashCommandJson } from "../handlers/Command/Slash/PinguSlashCommandBuilder";

export default class SlashCommandCollection {
    constructor(client: PinguClientBase, entries?: readonly (readonly [string, ApplicationCommand])[]) {
        this._client = client;
        this._inner = new Collection<string, ApplicationCommand>(entries);
    }

    private _client: PinguClientBase;
    private _inner: Collection<string, ApplicationCommand>;
    private get _clientCommands() {
        return this._client.application.commands;
    }

    private _set(name: string, command: ApplicationCommand) {
        this._inner.set(name, command);
        return this;
    }
    public get(name: string) {
        return this._inner.get(name);
    }

    public async postAll(client: PinguClientBase, commands: Array<PinguCommandBase>) {
        if (!client.isReady()) throw new Error(`Client is not ready yet!`);

        const json = commands.reduce((result, cmd) => {
            if (cmd.specificGuildId) {
                result.guildSpecific.push({
                    ...cmd.builder.toJSON(),
                    id: cmd.specificGuildId
                });
            }
            else result[cmd.guildOnly ? 
                'guildOnly' : 
                'all'
            ].push(cmd.builder.toJSON());
            return result;
        }, { all: new Array<SlashCommandJson>(), 
            guildOnly: new Array<SlashCommandJson>(), 
            guildSpecific: new Array<SlashCommandJson & { id: Snowflake }>() 
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
    public async post(...data: SlashCommandJson[]) {
        return this._post(data);
    }
    public async postTo(guildData: GuildResolvable, ...data: SlashCommandJson[]) {
        return this._post(data, guildData);
    }
    private async _post(data: SlashCommandJson[], guildData?: GuildResolvable) {
        const rest = new REST({ version: '9' }).setToken(this._client.token);
        const guild: Guild = typeof guildData == 'string' ? this._client.guilds.cache.get(guildData) : (guildData['guild'] || guildData);

        const cmds = await rest.put(
            Routes[guild ? 
                'applicationGuildCommands' : 
                'applicationCommands'
            ](this._client.id, guild.id), { body: data }
        );
        this._client.log('console', `Posted ${data.length} Slashcommands${guild ? ` to ${guild}` : ''}.`);
        console.log(cmds);
        return this;

        // return this._set(cmd.name, cmd);
    }
    public async put(data: ApplicationCommandData) {
        const cmd = await this._clientCommands.edit(this.get(data.name), data);
        return this._set(cmd.name, cmd);
    }
    public async delete(name: string) {
        await this._clientCommands.delete(this.get(name));
        this._inner.delete(name);
        return this;
    }
}