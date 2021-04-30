import { Guild, TextChannel, VoiceChannel } from 'discord.js';
import { Song, Queue } from '../../pingu/guild/items';
import PChannel from './PChannel';

export class PQueue {
    constructor(queue: Queue) {
        this.logChannel = new PChannel(queue.logChannel);
        this.voiceChannel = new PChannel(queue.voiceChannel);
        this.index = queue.index;
        this.songs = queue.songs;
        this.volume = queue.volume;
        this.loop = queue.loop;
        this.playing = queue.playing;
    }

    public logChannel: PChannel
    public voiceChannel: PChannel
    public index: number
    public songs: Song[]
    public volume: number
    public playing: boolean
    public loop: boolean;

    public static async ToQueue(guild: Guild, pQueue: PQueue) {
        let queue = new Queue(
            guild.channels.cache.find(c => c.id == pQueue.logChannel._id) as TextChannel,
            guild.channels.cache.find(c => c.id == pQueue.voiceChannel._id) as VoiceChannel,
            pQueue.songs,
            pQueue.playing
        );

        queue.connection = await queue.voiceChannel.join();
        queue.volume = pQueue.volume;
        queue.loop = pQueue.loop;
        queue.index = pQueue.index;

        return queue;
    }
}

export default PQueue;