import { ApplicationCommand } from "discord.js";
export declare class PinguSlashCommandBase extends ApplicationCommand {
    constructor(application: ApplicationCommand);
    path: string;
}
export default PinguSlashCommandBase;
