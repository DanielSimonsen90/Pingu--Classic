import { CommandInteraction, InteractionReplyOptions, Snowflake } from "discord.js";
import PinguClient from "../../client/PinguClient";
import SlashCommand, { Option, ExtraOptions as ExtraOptionsBase } from "../SlashCommand";
import { CommandParams } from "./PinguCommand";
interface ExtraOptions extends ExtraOptionsBase {
    specificGuildId?: Snowflake;
    mustBeBeta?: boolean;
}
export default class PinguSlashCommand extends SlashCommand {
    constructor(name: string, description: string, options: Option[], extra: ExtraOptions, onInteraction: (client: PinguClient, params: CommandParams, interaction: CommandInteraction) => InteractionReplyOptions);
    specificGuildId: Snowflake;
    mustBeBeta: boolean;
    onInteraction(client: PinguClient, params: CommandParams, interaction: CommandInteraction): InteractionReplyOptions;
}
export {};
