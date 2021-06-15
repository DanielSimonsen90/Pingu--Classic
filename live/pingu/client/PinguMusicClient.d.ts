import { Client, ClientEvents, ClientOptions, Collection } from "discord.js";
import PinguClient from "./PinguClient";
export declare function ToPinguMusicClient(client: Client): PinguMusicClient;
import { PinguClientEvents, PinguMusicCommand, PinguMusicClientEvents, PinguMusicEvent, PinguMusicCommandParams } from '../handlers';
import IConfigRequirements from '../../helpers/Config';
import Queue from "../guild/items/music/Queue/Queue";
import BasePinguClient from "./BasePinguClient";
interface VideoThing {
    url: string;
}
export declare class PinguMusicClient extends BasePinguClient<PinguClientEvents> {
    static ToPinguMusicClient(client: Client): PinguMusicClient;
    static Clients: {
        PinguID: string;
        BetaID: string;
    };
    constructor(config: IConfigRequirements, subscribedEvents?: Array<keyof PinguMusicClientEvents>, commandsPath?: string, eventsPath?: string, options?: ClientOptions);
    queues: Collection<string, Queue>;
    events: Collection<keyof PinguMusicClientEvents, PinguMusicEvent<keyof PinguMusicClientEvents>>;
    commands: Collection<string, PinguMusicCommand>;
    subscribedEvents: Array<keyof PinguMusicClientEvents>;
    AsPinguClient(): Promise<PinguClient>;
    emit<PMCE extends keyof PinguMusicClientEvents, CE extends keyof ClientEvents>(key: PMCE, ...args: PinguMusicClientEvents[PMCE]): boolean;
    getVideo(params: PinguMusicCommandParams, url: string, searchType: 'video' | 'playlist', youTube: any, ytdl: any): Promise<VideoThing>;
    protected HandlePath(path: string, type: 'command' | 'event'): void;
    protected handleEvent<EventType extends keyof PinguMusicClientEvents>(caller: EventType, ...args: PinguMusicClientEvents[EventType]): this;
    private getEventParams;
}
export default PinguMusicClient;
