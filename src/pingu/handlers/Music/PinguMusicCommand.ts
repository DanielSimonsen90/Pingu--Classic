import { PermissionString, VoiceChannel } from "discord.js";
import { ExecuteReturns } from "../Pingu/PinguCommand";
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

import ClassicCommandParams from "../ClassicCommandParams";
export interface PinguMusicCommandParams extends ClassicCommandParams, MusicCommandParams {
    client?: PinguMusicClient
}

interface PinguMusicCommandData {
    usage: string,
    examples?: string[],
    permissions: PermissionString[],
    aliases?: string[],
    queueRequired?: boolean
}

import PinguHandler from "../PinguHandler";
export class PinguMusicCommand extends PinguHandler {
    constructor(name: string, description: string, data: PinguMusicCommandData,
    execute: (params: PinguMusicCommandParams) => Promise<ExecuteReturns>) {
        super(name);
        this.description = description;
        if (execute) this.execute = execute;

        const { usage, examples, permissions, aliases, queueRequired } = data;
        
        this.permissions = permissions ?? [];
        this.usage = usage ?? "";
        this.examples = examples?.length ? examples : [""];
        this.aliases = aliases?.length && aliases;
        this.queueRequired = queueRequired ?? false;
    }

    public description: string;
    public usage: string;
    public examples: string[];
    public aliases: string[];
    public permissions: PermissionString[];
    public queueRequired = false;

    public execute(params: PinguMusicCommandParams): Promise<ExecuteReturns> {
        return params.client.log('error', `Execute for command **${this.name}**, was not defined!`)
    }
}

export default PinguMusicCommand;