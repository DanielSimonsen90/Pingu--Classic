import { ApplicationCommand } from "discord.js";

export class PinguSlashCommandBase extends ApplicationCommand {
    constructor(application: ApplicationCommand) {
        super(application.client, {
            name: application.name,
            description: application.description,
            id: application.id,
            application_id: application.applicationId,
        }, application.guild, application.guildId)
    }

    public path: string;
}
export default PinguSlashCommandBase;