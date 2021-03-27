import { Guild } from 'discord.js';
import { Song, Queue } from '../../pingu/guild/items';
import { PChannel } from './PChannel';
export declare class PQueue {
    constructor(queue: Queue);
    logChannel: PChannel;
    voiceChannel: PChannel;
    index: number;
    songs: Song[];
    volume: number;
    playing: boolean;
    loop: boolean;
    static ToQueue(guild: Guild, pQueue: PQueue): Promise<Queue>;
}
