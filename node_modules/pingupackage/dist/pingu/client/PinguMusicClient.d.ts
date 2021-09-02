import { ClientEvents, Collection } from "discord.js";
import PinguMusicCommand, { PinguMusicCommandParams } from '../handlers/PinguMusicCommand';
import PinguMusicEvent, { PinguMusicClientEvents } from '../handlers/PinguMusicEvent';
import Queue from "../guild/items/music/Queue/Queue";
import PinguClientBase from "./PinguClientBase";
interface VideoThing {
    url: string;
}
export declare class PinguMusicClient extends PinguClientBase<PinguMusicClientEvents> {
    queues: Collection<string, Queue>;
    events: Collection<keyof PinguMusicClientEvents, PinguMusicEvent<keyof PinguMusicClientEvents>>;
    commands: Collection<string, PinguMusicCommand>;
    subscribedEvents: Array<keyof PinguMusicClientEvents>;
    emit<PMCE extends keyof PinguMusicClientEvents, CE extends keyof ClientEvents>(key: PMCE, ...args: PinguMusicClientEvents[PMCE]): boolean;
    getVideo(params: PinguMusicCommandParams, url: string, searchType: 'video' | 'playlist', youTube: any, ytdl: any): Promise<VideoThing>;
    protected handlePath(path: string, type: 'command' | 'event'): void;
    protected handleEvent<EventType extends keyof PinguMusicClientEvents>(caller: EventType, ...args: PinguMusicClientEvents[EventType]): this;
}
export default PinguMusicClient;
