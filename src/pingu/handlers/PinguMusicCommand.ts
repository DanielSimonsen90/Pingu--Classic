import { Message, PermissionString, VoiceChannel } from "discord.js";
import { ExecuteReturns } from "./PinguCommand";
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

import PinguHandler from "./PinguHandler";
export class PinguMusicCommand extends PinguHandler {
    constructor(name: string, description: string, data: {
        usage: string,
        examples?: string[],
        permissions: PermissionString[],
        aliases?: string[],
        queueRequired?: boolean
    },
    execute: (params: PinguMusicCommandParams) => Promise<ExecuteReturns>) {
        super(name);
        this.description = description;
        if (execute) this.execute = execute;

        const { usage, examples, permissions, aliases, queueRequired } = data;
        
        this.usage = usage || "";
        this.examples = examples?.length ? examples : [""];
        this.aliases = aliases?.length && aliases;
        this.queueRequired = queueRequired || false;
    }

    public description: string;
    public usage: string;
    public examples: string[];
    public aliases: string[];
    public queueRequired = false;

    public execute(params: PinguMusicCommandParams): Promise<ExecuteReturns> {
        return errorLog(params.message.client, `Execute for command **${this.name}**, was not defined!`);
    }
}

export default PinguMusicCommand;