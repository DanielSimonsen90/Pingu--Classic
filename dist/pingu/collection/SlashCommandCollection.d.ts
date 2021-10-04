import { ApplicationCommand, ApplicationCommandData, GuildResolvable } from "discord.js";
import PinguClientBase from "../client/PinguClientBase";
import PinguCommandBase from "../handlers/Command/PinguCommandBase";
import { SlashCommandJson } from "../handlers/Command/Slash/PinguSlashCommandBuilder";
export default class SlashCommandCollection {
    constructor(client: PinguClientBase, entries?: readonly (readonly [string, ApplicationCommand])[]);
    private _client;
    private _inner;
    private get _clientCommands();
    private _set;
    get(name: string): ApplicationCommand<{}>;
    postAll(client: PinguClientBase, commands: Array<PinguCommandBase>): Promise<this>;
    post(...data: SlashCommandJson[]): Promise<this>;
    postTo(guildData: GuildResolvable, ...data: SlashCommandJson[]): Promise<this>;
    private _post;
    put(data: ApplicationCommandData): Promise<this>;
    delete(name: string): Promise<this>;
}
