"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
    static ToQueue(guild, pQueue) {
        return __awaiter(this, void 0, void 0, function* () {
            let queue = new items_1.Queue(guild.channels.cache.find(c => c.id == pQueue.logChannel._id), guild.channels.cache.find(c => c.id == pQueue.voiceChannel._id), pQueue.songs, pQueue.playing);
            queue.connection = yield queue.voiceChannel.join();
            queue.volume = pQueue.volume;
            queue.loop = pQueue.loop;
            queue.index = pQueue.index;
            return queue;
        });
    }
}
exports.PQueue = PQueue;
exports.default = PQueue;
