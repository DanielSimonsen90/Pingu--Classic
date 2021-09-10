import { Message, PermissionString, VoiceChannel } from "discord.js";
import { ExecuteReturns } from "../Pingu/PinguCommand";
import PinguGuild from "../../guild/PinguGuild";
import PinguMusicClient from "../../client/PinguMusicClient";
import PClient from "../../../database/json/PClient";
import Queue from "../../guild/items/music/Queue/Queue";
import Arguments from '../../../helpers/Arguments';
export interface PinguMusicCommandParams {
    client?: PinguMusicClient;
    message: Message;
    queue?: Queue;
    voiceChannel?: VoiceChannel;
    args?: Arguments;
    pGuild?: PinguGuild;
    pGuildClient: PClient;
}
import PinguHandler from "../PinguHandler";
export declare class PinguMusicCommand extends PinguHandler {
    constructor(name: string, description: string, data: {
        usage: string;
        examples?: string[];
        permissions: PermissionString[];
        aliases?: string[];
        queueRequired?: boolean;
    }, execute: (params: PinguMusicCommandParams) => Promise<ExecuteReturns>);
    description: string;
    usage: string;
    examples: string[];
    aliases: string[];
    queueRequired: boolean;
    execute(params: PinguMusicCommandParams): Promise<ExecuteReturns>;
}
export default PinguMusicCommand;
