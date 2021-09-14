import { CommandInteraction, InteractionReplyOptions } from "discord.js";
import { PinguMusicClient } from "../..";
import PinguSlashCommandBuilderBase, { Option, ExtraOptions as ExtraOptionsBase } from "../PinguSlashCommandBuilderBase";
import { MusicCommandParams } from "./PinguMusicCommand";
interface ExtraOptions extends ExtraOptionsBase {
    queueRequired?: boolean;
}
export default class PinguMusicSlashCommandBuilder extends PinguSlashCommandBuilderBase {
    constructor(name: string, description: string, options: Option[], extra: ExtraOptions, onInteraction: (client: PinguMusicClient, params: MusicCommandParams, interaction: CommandInteraction) => InteractionReplyOptions);
    queueRequired: boolean;
    onInteraction(client: PinguMusicClient, params: MusicCommandParams, interaction: CommandInteraction): InteractionReplyOptions;
}
export {};
