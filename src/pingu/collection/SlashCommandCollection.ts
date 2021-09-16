import { Collection, ApplicationCommand } from "discord.js";
import PinguClientBase from "../client/PinguClientBase";

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

    public async post(name: string, command: ApplicationCommand) {
        await this._clientCommands.create(command);
        return this._set(name, command);
    }
    public async put(name: string, update: ApplicationCommand) {
        await this._clientCommands.edit(this.get(name), update);
        return this._set(name, update);
    }
    public async delete(name: string) {
        await this._clientCommands.delete(this.get(name));
        this._inner.delete(name);
        return this;
    }
}