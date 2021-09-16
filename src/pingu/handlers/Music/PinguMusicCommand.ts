import { VoiceChannel } from "discord.js";
import PinguGuild from "../../guild/PinguGuild";
import PinguMusicClient from "../../client/PinguMusicClient";
import PClient from "../../../database/json/PClient";
import Queue from "../../guild/items/music/Queue/Queue";

export interface MusicCommandParams {
    queue?: Queue,
    voiceChannel?: VoiceChannel,
    pGuild?: PinguGuild,
    pGuildClient?: PClient
}

export interface PinguMusicCommandParams extends ClassicCommandParams, MusicCommandParams {
    client: PinguMusicClient
}

interface PinguMusicCommandData extends BaseCommandData {
    queueRequired?: boolean
}

import PinguCommandBase, { BaseCommandData, ClassicCommandParams, ExecuteFunctions } from "../Command/PinguCommandBase";
import PinguSlashCommandBuilder, { SlashCommandConstructionData } from "../Command/Slash/PinguSlashCommandBuilder";
export class PinguMusicCommand extends PinguCommandBase {
    constructor(name: string, description: string, 
        data: PinguMusicCommandData,
        slashCommandBuilder: SlashCommandConstructionData,
        executes: ExecuteFunctions<PinguMusicClient, PinguMusicCommandParams>
    ) {
        super(name, description, data, new PinguSlashCommandBuilder(name, description, slashCommandBuilder), executes);
        const { queueRequired } = data;
        this.queueRequired = queueRequired ?? false;
    }

    public queueRequired = false;
}

export default PinguMusicCommand;