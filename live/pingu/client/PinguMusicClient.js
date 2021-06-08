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
exports.PinguMusicClient = exports.ToPinguMusicClient = void 0;
const discord_js_1 = require("discord.js");
const PinguClient_1 = require("./PinguClient");
function ToPinguMusicClient(client) {
    return client;
}
exports.ToPinguMusicClient = ToPinguMusicClient;
const Queue_1 = require("../guild/items/music/Queue/Queue");
const PinguLibrary_1 = require("../library/PinguLibrary");
const Song_1 = require("../guild/items/music/Song");
class PinguMusicClient extends PinguClient_1.PinguClient {
    //#endregion 
    constructor(config, subscribedEvents, commandsPath, eventsPath, options) {
        super(config, subscribedEvents, commandsPath, eventsPath, options);
        this.queues = new discord_js_1.Collection();
        this.events = new discord_js_1.Collection();
        this.commands = new discord_js_1.Collection();
    }
    //#region Statics
    static ToPinguMusicClient(client) { return ToPinguMusicClient(client); }
    // public subscribedEvents: [keyof PinguMusicClientEvents];
    emit(key, ...args) {
        console.log(typeof key);
        throw Error("NotImplementedException");
        return super.emit(key, ...args);
    }
    getVideo(params, url, searchType, youTube, ytdl) {
        return __awaiter(this, void 0, void 0, function* () {
            const { client, message, args, voiceChannel } = params;
            let { queue } = params;
            try {
                var video = yield youTube.getVideo(url);
            }
            catch (convErr) {
                if (!convErr.message.includes(`No video ID found in URL:`))
                    PinguLibrary_1.errorLog(client, `URL failed`, message.content, convErr, {
                        params: { message, args, voiceChannel, queue },
                        additional: { searchType, url },
                        trycatch: { video }
                    });
                try {
                    if (searchType == 'video') {
                        var searchResultVideos = yield youTube.searchVideos(url, 1);
                        video = yield youTube.getVideoByID(searchResultVideos[0].id);
                    }
                    else {
                        var searchResultVideos = yield youTube.searchPlaylists(`"${url}"`, 1, { type: 'playlist' });
                        var playlist = yield youTube.getPlaylistByID(searchResultVideos[0].id);
                        var playlistVideos = yield playlist.getVideos();
                        var ytdlCoreVideos = playlistVideos.map(v => ytdl.getInfo(v.url));
                        let songs = [];
                        for (var i = 0; i < ytdlCoreVideos.length; i++) {
                            let song = new Song_1.Song(message.author, yield ytdlCoreVideos[i]);
                            songs.push(song);
                        }
                        if (queue) {
                            queue.add(...songs);
                            yield Promise.all([
                                queue.Update(message, "HandlePlay", `Playlist was added to queue`),
                                queue.AnnounceMessage(message, `Added **${playlist.title}** to the queue!`, `${message.author.username} added **${playlist.title}** (playlist) to the queue.`)
                            ]);
                            return null;
                        }
                        else {
                            queue = new Queue_1.Queue(message.channel, voiceChannel, songs);
                            queue.connection = yield voiceChannel.join();
                            client.emit('play', queue, message, queue.songs[0]);
                            return null;
                        }
                    }
                }
                catch (err) {
                    if (err.message == "Cannot read property 'id' of undefined") {
                        yield message.channel.send(`I couldn't find that!`);
                        return null;
                    }
                    yield PinguLibrary_1.errorLog(client, `Search failed`, message.content, err, {
                        params: { message, args, voiceChannel, queue },
                        additional: { searchType, url },
                        trycatch: { searchResultVideos, video, playlist, playlistVideos, ytdlCoreVideos }
                    });
                    return null;
                }
            }
        });
    }
}
exports.PinguMusicClient = PinguMusicClient;
