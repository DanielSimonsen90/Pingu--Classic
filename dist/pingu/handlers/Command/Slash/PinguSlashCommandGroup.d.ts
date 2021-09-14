import { SlashCommandSubcommandGroupBuilder } from "@discordjs/builders";
import PinguSlashCommandSub from "./PinguSlashCommandSub";
export declare class PinguSlashCommandGroup extends SlashCommandSubcommandGroupBuilder {
    constructor(name: string, description: string, subCommands: PinguSlashCommandSub[]);
}
