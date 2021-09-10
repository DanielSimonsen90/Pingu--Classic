import { CommandInteraction, InteractionReplyOptions } from "discord.js";
import { PinguMusicClient } from "../..";
import SlashCommand, { Option, ExtraOptions as ExtraOptionsBase } from "../SlashCommand";
import { MusicCommandParams } from "./PinguMusicCommand";

interface ExtraOptions extends ExtraOptionsBase {
    queueRequired?: boolean
}

export default class PinguMusicSlashCommand extends SlashCommand {
    constructor(name: string, description: string, options: Option[], extra: ExtraOptions,
        onInteraction: (client: PinguMusicClient, params: MusicCommandParams, interaction: CommandInteraction) => InteractionReplyOptions
    ) {
        super(name, description, options, extra);

        const { queueRequired } = extra;
        this.queueRequired = queueRequired ?? false;
        
        if (onInteraction) this.onInteraction = onInteraction;
    }

    public queueRequired: boolean;

    public onInteraction(client: PinguMusicClient, params: MusicCommandParams, interaction: CommandInteraction): InteractionReplyOptions {
        client.log('error', `Interaction for ${this.name} is not implemented!`);
        return null;
    }
}