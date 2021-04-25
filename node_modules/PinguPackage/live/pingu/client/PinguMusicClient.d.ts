import { Client, ClientOptions, Collection } from "discord.js";
import { PinguClient } from "./PinguClient";
export declare function ToPinguMusicClient(client: Client): PinguMusicClient;
import { PinguClientEvents, PinguMusicCommand, PinguMusicClientEvents, PinguMusicEvent, PinguMusicCommandParams } from '../handlers';
import { IConfigRequirements } from '../../helpers/Config';
import { Queue } from "../guild/items/music/Queue/Queue";
interface VideoThing {
    url: string;
}
export declare class PinguMusicClient extends PinguClient {
    static ToPinguMusicClient(client: Client): PinguMusicClient;
    constructor(config: IConfigRequirements, subscribedEvents: [keyof PinguMusicClientEvents], commandsPath?: string, eventsPath?: string, options?: ClientOptions);
    queues: Collection<string, Queue>;
    events: Collection<string, PinguMusicEvent<keyof PinguMusicClientEvents, keyof PinguClientEvents>>;
    commands: Collection<string, PinguMusicCommand>;
    emit<PMCE extends keyof PinguMusicClientEvents, PCE extends keyof PinguClientEvents>(key: PMCE, ...args: PinguMusicClientEvents[PMCE]): boolean;
    getVideo(params: PinguMusicCommandParams, url: string, searchType: 'video' | 'playlist', youTube: any, ytdl: any): Promise<VideoThing>;
}
export {};
