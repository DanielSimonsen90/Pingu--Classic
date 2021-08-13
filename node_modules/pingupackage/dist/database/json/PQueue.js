"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PQueue = void 0;
const items_1 = require("../../pingu/guild/items");
const PChannel_1 = require("./PChannel");
class PQueue {
    constructor(queue) {
        this.logChannel = new PChannel_1.default(queue.logChannel);
        this.voiceChannel = new PChannel_1.default(queue.voiceChannel);
        this.index = queue.index;
        this.songs = queue.songs;
        this.volume = queue.volume;
        this.loop = queue.loop;
        this.playing = queue.playing;
    }
    logChannel;
    voiceChannel;
    index;
    songs;
    volume;
    playing;
    loop;
    static async ToQueue(guild, pQueue) {
        let queue = new items_1.Queue(guild.channels.cache.find(c => c.id == pQueue.logChannel._id), guild.channels.cache.find(c => c.id == pQueue.voiceChannel._id), pQueue.songs, pQueue.playing);
        queue.connection = queue.voiceChannel.join();
        queue.volume = pQueue.volume;
        queue.loop = pQueue.loop;
        queue.index = pQueue.index;
        return queue;
    }
}
exports.PQueue = PQueue;
exports.default = PQueue;
