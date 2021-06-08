import { GuildMember, Message, VoiceChannel } from "discord.js";
import { PinguClientEvents } from "./PinguEvent";
import { Queue } from "../guild/items/music/Queue/Queue";
import { Song } from "../guild/items/music/Song";
import { PinguMusicClient } from "../client/PinguMusicClient";
/**
 * Arguments that came with the command
 */
declare type CommandArgumnents = string[];
declare type QueueMessage = [Queue, Message];
declare type QueueMessageArgs = [...QueueMessage, CommandArgumnents];
declare type QueueMessageSong = [...QueueMessage, Song];
export interface PinguMusicEvents {
    /**[
     *  Voice channel that was joined,
     *  GuildMember that requested the join
     * ]
     */
    voiceChannelJoin: [VoiceChannel, GuildMember];
    voiceChannelDisconnect: [VoiceChannel, GuildMember, Queue];
    commandPlay: [...QueueMessage, VoiceChannel, CommandArgumnents];
    commandPlayskip: QueueMessageArgs;
    commandRemove: QueueMessageArgs;
    commandStop: QueueMessage;
    commandSkip: QueueMessage;
    commandNowPlaying: QueueMessage;
    commandVolume: [...QueueMessage, string];
    commandQueue: QueueMessage;
    commandPauseResume: [Queue, boolean];
    commandMove: QueueMessageArgs;
    commandLoop: QueueMessageArgs;
    commandRestart: QueueMessageArgs;
    commandShuffle: QueueMessage;
    controlPanelRequest: [...QueueMessage, boolean];
    play: QueueMessageSong;
    resetClient: [Message];
    dispatcherStart: QueueMessageSong;
    dispatcherError: [...QueueMessageSong, Error];
    dispatcherFinish: QueueMessageSong;
}
export interface PinguMusicClientEvents extends PinguMusicEvents, PinguClientEvents {
}
import { PinguEvent } from "./PinguEvent";
export declare class PinguMusicEvent<eventType extends keyof PinguMusicClientEvents, baseEventType extends keyof PinguClientEvents> extends PinguEvent<baseEventType> {
    constructor(name: eventType, execute?: (client: PinguMusicClient, ...args: PinguMusicClientEvents[eventType]) => Promise<Message>);
    name: baseEventType;
    execute(client: PinguMusicClient, ...args: PinguMusicClientEvents[baseEventType]): Promise<Message>;
}
export {};
