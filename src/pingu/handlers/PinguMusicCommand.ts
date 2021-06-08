import { Message, PermissionString, VoiceChannel } from "discord.js";
import { PinguCommand, ExecuteReturns } from "./PinguCommand";
import PinguGuild from "../guild/PinguGuild";
import PinguMusicClient from "../client/PinguMusicClient";
import { errorLog } from "../library/PinguLibrary";
import PClient from "../../database/json/PClient";
import Queue from "../guild/items/music/Queue/Queue";

export interface PinguMusicCommandParams {
    client?: PinguMusicClient,
    message: Message,
    queue?: Queue,
    voiceChannel?: VoiceChannel,
    args?: string[],
    pGuild?: PinguGuild,
    pGuildClient: PClient
}

export class PinguMusicCommand extends PinguCommand {
    constructor(name: string, description: string, data: {
        usage: string,
        examples?: string[],
        permissions: PermissionString[],
        aliases?: string[],
        queueRequired?: boolean
    },
    execute: (params: PinguMusicCommandParams) => Promise<ExecuteReturns>) {
        super(name, 'Fun', description, data, execute);
        this.queueRequired = data.queueRequired;
    }

    public queueRequired = false;

    public execute(params: PinguMusicCommandParams): Promise<ExecuteReturns> {
        return errorLog(params.message.client, `Execute for command **${this.name}**, was not defined!`);
    }
}

export default PinguMusicCommand;