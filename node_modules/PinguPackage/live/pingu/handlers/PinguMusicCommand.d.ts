import { Message, PermissionString, VoiceChannel } from "discord.js";
import { PinguCommand, ExecuteReturns } from "./PinguCommand";
import { PinguGuild } from "../guild/PinguGuild";
import { PinguMusicClient } from "../client/PinguMusicClient";
import { PClient } from "../../database/json/PClient";
import { Queue } from "../guild/items/music/Queue/Queue";
export interface PinguMusicCommandParams {
    client?: PinguMusicClient;
    message: Message;
    queue?: Queue;
    voiceChannel?: VoiceChannel;
    args?: string[];
    pGuild?: PinguGuild;
    pGuildClient: PClient;
}
export declare class PinguMusicCommand extends PinguCommand {
    constructor(name: string, description: string, data: {
        usage: string;
        examples?: string[];
        permissions: PermissionString[];
        aliases?: string[];
        queueRequired?: boolean;
    }, execute: (params: PinguMusicCommandParams) => Promise<ExecuteReturns>);
    queueRequired: boolean;
    execute(params: PinguMusicCommandParams): Promise<ExecuteReturns>;
}
