import { PermissionString, VoiceChannel } from "discord.js";
import { ExecuteReturns } from "../Pingu/PinguCommand";
import PinguGuild from "../../guild/PinguGuild";
import PinguMusicClient from "../../client/PinguMusicClient";
import PClient from "../../../database/json/PClient";
import Queue from "../../guild/items/music/Queue/Queue";
export interface MusicCommandParams {
    queue?: Queue;
    voiceChannel?: VoiceChannel;
    pGuild?: PinguGuild;
    pGuildClient?: PClient;
}
import ClassicCommandParams from "../ClassicCommandParams";
export interface PinguMusicCommandParams extends ClassicCommandParams, MusicCommandParams {
    client?: PinguMusicClient;
}
interface PinguMusicCommandData {
    usage: string;
    examples?: string[];
    permissions: PermissionString[];
    aliases?: string[];
    queueRequired?: boolean;
}
import PinguHandler from "../PinguHandler";
export declare class PinguMusicCommand extends PinguHandler {
    constructor(name: string, description: string, data: PinguMusicCommandData, execute: (params: PinguMusicCommandParams) => Promise<ExecuteReturns>);
    description: string;
    usage: string;
    examples: string[];
    aliases: string[];
    permissions: PermissionString[];
    queueRequired: boolean;
    execute(params: PinguMusicCommandParams): Promise<ExecuteReturns>;
}
export default PinguMusicCommand;
