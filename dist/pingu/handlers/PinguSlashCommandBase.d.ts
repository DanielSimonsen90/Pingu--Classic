import { ApplicationCommand } from "discord.js";
export default class PinguSlashCommandBase extends ApplicationCommand {
    constructor(application: ApplicationCommand);
    path: string;
}
