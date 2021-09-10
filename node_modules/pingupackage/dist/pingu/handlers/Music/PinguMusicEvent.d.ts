import { GuildMember, Message, VoiceChannel } from "discord.js";
import { PinguClientEvents } from "../Pingu/PinguEvent";
import Queue from "../../guild/items/music/Queue/Queue";
import Song from "../../guild/items/music/Song";
import PinguMusicClient from "../../client/PinguMusicClient";
declare type QueueMessage = [Queue, Message];
declare type QueueMessageSong = [...QueueMessage, Song];
export interface PinguMusicEvents {
    voiceChannelJoin: [VoiceChannel, GuildMember];
    voiceChannelDisconnect: [VoiceChannel, GuildMember, Queue];
    commandPauseResume: [Queue, boolean];
    controlPanelRequest: [...QueueMessage, boolean];
    play: [...QueueMessageSong];
    resetClient: [Message];
    dispatcherStart: [...QueueMessageSong];
    dispatcherError: [...QueueMessageSong, Error];
    dispatcherFinish: [...QueueMessageSong];
}
export interface PinguMusicClientEvents extends PinguMusicEvents, PinguClientEvents {
}
export declare function HandleMusicEvent<EventType extends keyof PinguMusicClientEvents>(caller: EventType, client: PinguMusicClient, ...args: PinguMusicClientEvents[EventType]): Promise<Message>;
import PinguHandler from "../PinguHandler";
export declare class PinguMusicEvent<Event extends keyof PinguMusicClientEvents> extends PinguHandler {
    static HandleEvent<EventType extends keyof PinguMusicClientEvents>(caller: EventType, client: PinguMusicClient, path: string, ...args: PinguMusicClientEvents[EventType]): Promise<Message>;
    constructor(name: Event, execute?: (client: PinguMusicClient, ...args: PinguMusicClientEvents[Event]) => Promise<Message>);
    name: Event;
    execute(client: PinguMusicClient, ...args: PinguMusicClientEvents[Event]): Promise<Message>;
}
export default PinguMusicEvent;
