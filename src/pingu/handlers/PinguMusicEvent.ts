import { GuildMember, Message, VoiceChannel } from "discord.js";
import { PinguClientEvents } from "./PinguEvent";
import Queue from "../guild/items/music/Queue/Queue";
import Song from "../guild/items/music/Song";
import PinguMusicClient from "../client/PinguMusicClient";

type QueueMessage = [Queue, Message];
type QueueMessageSong = [...QueueMessage, Song]

export interface PinguMusicEvents {
    voiceChannelJoin: [VoiceChannel, GuildMember],
    voiceChannelDisconnect: [VoiceChannel, GuildMember, Queue],
    commandPauseResume: [Queue, boolean],

    controlPanelRequest: [...QueueMessage, boolean],

    play: [...QueueMessageSong],
    resetClient: [Message]

    dispatcherStart: [...QueueMessageSong],
    dispatcherError: [...QueueMessageSong, Error],
    dispatcherFinish: [...QueueMessageSong]
}
export interface PinguMusicClientEvents extends PinguMusicEvents, PinguClientEvents {}

export async function HandleMusicEvent<EventType extends keyof PinguMusicClientEvents>(
    caller: EventType, 
    client: PinguMusicClient, 
    ...args: PinguMusicClientEvents[EventType]
) {
    try { var event = client.events.get(caller) }
    catch (err) {
        console.error({ err, caller });
        return client.log('error', `Unable to get event for ${caller}`, null, err, {
            params: { caller, args },
            additional: { event }
        });
    }

    if (!event || !event.execute) return;

    async function execute() {
        try { return event.execute(client, ...args); } 
        catch (err) { client.log('error', `${event.name}.execute`, null, err, {
                params: { caller, args },
                additional: { event }
            });
        }
    }

    await execute().catch(err => {
        return client.log('error', err.message, JSON.stringify(args, null, 2), err, {
            params: { caller, args },
            additional: { event }
        });
    })
}

import PinguHandler from "./PinguHandler";
export class PinguMusicEvent<Event extends keyof PinguMusicClientEvents> extends PinguHandler {
    public static HandleEvent<EventType extends keyof PinguMusicClientEvents>(caller: EventType, client: PinguMusicClient, path: string, ...args: PinguMusicClientEvents[EventType]) {
        return HandleMusicEvent(caller, client, ...args);
    }

    constructor(name: Event, execute?: (client: PinguMusicClient, ...args: PinguMusicClientEvents[Event]) => Promise<Message>) {
        super(name);
        this.execute = execute;
    }

    declare name: Event;

    public async execute(client: PinguMusicClient, ...args: PinguMusicClientEvents[Event]): Promise<Message> { return null; }
}

export default PinguMusicEvent;