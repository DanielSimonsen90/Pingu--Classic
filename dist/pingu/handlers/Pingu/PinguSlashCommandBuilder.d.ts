import { CommandInteraction, InteractionReplyOptions, Snowflake } from "discord.js";
import PinguClient from "../../client/PinguClient";
import PinguSlashCommandBuilderBase, { Option, ExtraOptions } from "../Command/Slash/PinguSlashCommandBuilderBase";
import { CommandParams } from "./PinguCommand";
export interface SlashCommandConstructionData {
    options: Option[];
    extra: ExtraOptions;
    onInteraction: (client: PinguClient, params: CommandParams, interaction: CommandInteraction) => InteractionReplyOptions;
}
export default class PinguSlashCommandBuilder extends PinguSlashCommandBuilderBase {
    constructor(name: string, description: string, options: Option[], extra: ExtraOptions, onInteraction: (client: PinguClient, params: CommandParams, interaction: CommandInteraction) => InteractionReplyOptions);
    specificGuildId: Snowflake;
    mustBeBeta: boolean;
    onInteraction(client: PinguClient, params: CommandParams, interaction: CommandInteraction): InteractionReplyOptions;
}
