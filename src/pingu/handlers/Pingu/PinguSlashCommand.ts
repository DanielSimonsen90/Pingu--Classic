import { CommandInteraction, InteractionReplyOptions, Snowflake } from "discord.js";
import PinguClient from "../../client/PinguClient";
import SlashCommand, { Option, ExtraOptions as ExtraOptionsBase } from "../SlashCommand";
import { CommandParams } from "./PinguCommand";

interface ExtraOptions extends ExtraOptionsBase {
    specificGuildId?: Snowflake,
    mustBeBeta?: boolean,
}

export default class PinguSlashCommand extends SlashCommand {
    constructor(name: string, description: string, options: Option[], extra: ExtraOptions,
        onInteraction: (client: PinguClient, params: CommandParams, interaction: CommandInteraction) => InteractionReplyOptions
    ) {
        super(name, description, options, extra);

        const { specificGuildId, mustBeBeta } = extra;

        this.specificGuildId = specificGuildId;
        this.mustBeBeta = mustBeBeta ?? false;
        if (onInteraction) this.onInteraction = onInteraction;
    }

    public specificGuildId: Snowflake;
    public mustBeBeta: boolean;

    public onInteraction(client: PinguClient, params: CommandParams, interaction: CommandInteraction): InteractionReplyOptions {
        client.log('error', `Interaction for ${this.name} is not implemented!`);
        return null;
    }
}