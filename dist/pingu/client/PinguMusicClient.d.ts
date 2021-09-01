import { ClientEvents, Collection } from "discord.js";
import { PinguMusicCommand, PinguMusicClientEvents, PinguMusicEvent, PinguMusicCommandParams } from '../handlers';
import Queue from "../guild/items/music/Queue/Queue";
import BasePinguClient from "./BasePinguClient";
interface VideoThing {
    url: string;
}
import { PinguMusicIntentEvents } from '../../helpers/IntentEvents';
export declare class PinguMusicClient extends BasePinguClient<PinguMusicIntentEvents> {
    queues: Collection<string, Queue>;
    events: Collection<keyof PinguMusicIntentEvents, PinguMusicEvent<keyof PinguMusicClientEvents>>;
    commands: Collection<string, PinguMusicCommand>;
    emit<PMCE extends keyof PinguMusicClientEvents, CE extends keyof ClientEvents>(key: PMCE, ...args: PinguMusicClientEvents[PMCE]): boolean;
    getVideo(params: PinguMusicCommandParams, url: string, searchType: 'video' | 'playlist', youTube: any, ytdl: any): Promise<VideoThing>;
    protected handlePath(path: string, type: 'command' | 'event'): void;
    protected handleEvent<EventType extends keyof PinguMusicClientEvents>(caller: EventType, ...args: PinguMusicClientEvents[EventType]): this;
}
export default PinguMusicClient;
