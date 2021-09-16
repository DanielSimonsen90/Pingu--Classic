import { ApplicationCommand } from "discord.js";
import PinguClientBase from "../client/PinguClientBase";
export default class SlashCommandCollection {
    constructor(client: PinguClientBase, entries?: readonly (readonly [string, ApplicationCommand])[]);
    private _client;
    private _inner;
    private get _clientCommands();
    private _set;
    get(name: string): ApplicationCommand<{}>;
    post(name: string, command: ApplicationCommand): Promise<this>;
    put(name: string, update: ApplicationCommand): Promise<this>;
    delete(name: string): Promise<this>;
}
