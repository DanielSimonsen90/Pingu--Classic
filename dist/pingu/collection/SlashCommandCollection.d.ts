import PinguClientBase from "../client/PinguClientBase";
import PinguSlashCommandBase from "../handlers/Command/Slash/PinguSlashCommandBase";
export default class SlashCommandCollection {
    constructor(client: PinguClientBase, entries?: readonly (readonly [string, PinguSlashCommandBase])[]);
    private _client;
    private _inner;
    private get _clientCommands();
    private _set;
    get(name: string): PinguSlashCommandBase;
    post(name: string, command: PinguSlashCommandBase): Promise<this>;
    put(name: string, update: PinguSlashCommandBase): Promise<this>;
    delete(name: string): Promise<this>;
}
