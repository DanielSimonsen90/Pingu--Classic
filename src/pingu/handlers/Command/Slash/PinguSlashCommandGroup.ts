import { SlashCommandSubcommandGroupBuilder } from "@discordjs/builders";
import PinguClientBase from "../../../client/PinguClientBase";
import { SlashCommandOption } from "./PinguSlashCommandBuilder";
import PinguSlashCommandSub, { SubCommandExtraOptions } from "./PinguSlashCommandSub";

export class PinguSlashCommandGroup extends SlashCommandSubcommandGroupBuilder {
    constructor(name: string, description: string, subCommands: PinguSlashCommandSub[]) {
        super();

        this.setName(name)
        this.setDescription(description)
        subCommands.forEach(scmd => this.addSubcommand(() => scmd));
    }
}