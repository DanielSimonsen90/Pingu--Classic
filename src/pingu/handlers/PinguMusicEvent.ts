import { GuildMember, Message, VoiceChannel } from "discord.js";
import { PinguClientEvents } from "./PinguEvent";
import Queue from "../guild/items/music/Queue/Queue";
import Song from "../guild/items/music/Song";
import PinguMusicClient from "../client/PinguMusicClient";
import PinguClient from "../client/PinguClient";

/**
 * Arguments that came with the command
 */
type CommandArgumnents = string[];

type QueueMessage = [Queue, Message];
type QueueMessageArgs = [...QueueMessage, CommandArgumnents];
type QueueMessageSong = [...QueueMessage, Song]

export interface PinguMusicEvents {
    /**[
     *  Voice channel that was joined, 
     *  GuildMember that requested the join
     * ]
     */
    voiceChannelJoin: [VoiceChannel, GuildMember],
    voiceChannelDisconnect: [VoiceChannel, GuildMember, Queue],
    // commandPlay: [...QueueMessage, VoiceChannel, CommandArgumnents],
    // commandPlayskip: QueueMessageArgs,s
    // commandRemove: QueueMessageArgs,
    // commandStop: QueueMessage,
    // commandSkip: QueueMessage,
    // commandNowPlaying: QueueMessage,
    // commandVolume: [...QueueMessage, string],
    // commandQueue: QueueMessage,
    commandPauseResume: [Queue, boolean],
    // commandMove: QueueMessageArgs,
    // commandLoop: QueueMessageArgs,
    // commandRestart: QueueMessageArgs,
    // commandShuffle: QueueMessage,

    controlPanelRequest: [...QueueMessage, boolean],

    play: QueueMessageSong,
    resetClient: [Message]

    dispatcherStart: QueueMessageSong,
    dispatcherError: [...QueueMessageSong, Error],
    dispatcherFinish: QueueMessageSong
}
export interface PinguMusicClientEvents extends PinguMusicEvents, PinguClientEvents {}


import { PinguEvent } from "./PinguEvent";
export class PinguMusicEvent<eventType extends keyof PinguMusicClientEvents, baseEventType extends keyof PinguClientEvents> extends PinguEvent<baseEventType> {
    constructor(name: eventType, execute?: (client: PinguMusicClient, ...args: PinguMusicClientEvents[eventType]) => Promise<Message>) {
        super(name as unknown as baseEventType);
        this.execute = execute as unknown as (client: PinguClient, ...args: PinguClientEvents[baseEventType]) => Promise<Message>;
    }

    name: baseEventType;

    public async execute(client: PinguMusicClient, ...args: PinguMusicClientEvents[baseEventType]): Promise<Message> { return null; }
}

export default PinguMusicEvent;