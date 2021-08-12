import { ClientEvents, ClientOptions, Collection, PermissionString } from "discord.js";
import { PinguClientEvents, PinguMusicCommand, PinguMusicClientEvents, PinguMusicEvent, PinguMusicCommandParams } from '../handlers';
import IConfigRequirements from '../../helpers/Config';
import Queue from "../guild/items/music/Queue/Queue";
import BasePinguClient from "./BasePinguClient";
interface VideoThing {
    url: string;
}
export declare class PinguMusicClient extends BasePinguClient<PinguClientEvents> {
    constructor(config: IConfigRequirements, permissions: PermissionString[], subscribedEvents: [keyof PinguMusicClientEvents], dirname?: string, commandsPath?: string, eventsPath?: string, options?: ClientOptions);
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
