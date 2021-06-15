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
const handlers_1 = require("../handlers");
const Queue_1 = require("../guild/items/music/Queue/Queue");
const PinguLibrary_1 = require("../library/PinguLibrary");
const Song_1 = require("../guild/items/music/Song");
const BasePinguClient_1 = require("./BasePinguClient");
const fs = require("fs");
class PinguMusicClient extends BasePinguClient_1.default {
    //#endregion 
    constructor(config, subscribedEvents, commandsPath, eventsPath, options) {
        super(config, subscribedEvents, commandsPath, eventsPath, options);
        this.queues = new discord_js_1.Collection();
    }
    //#region Statics
    static ToPinguMusicClient(client) { return ToPinguMusicClient(client); }
    AsPinguClient() {
        return __awaiter(this, void 0, void 0, function* () {
            const client = new PinguClient_1.default(this.config);
            yield client.login(this.token);
            return client;
        });
    }
    emit(key, ...args) {
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
                            let song = new Song_1.default(message.author, yield ytdlCoreVideos[i]);
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
                            queue = new Queue_1.default(message.channel, voiceChannel, songs);
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
    HandlePath(path, type) {
        let collection = fs.readdirSync(path);
        for (const file of collection) {
            try {
                if (file.endsWith('.js')) {
                    let module = require(`../../../../../${path}/${file}`);
                    module.path = `${path.substring(1, path.length)}/${file}`;
                    if (type == 'event') {
                        if (!module.name || !this.subscribedEvents.find(e => module.name == e))
                            continue;
                        const type = module.name;
                        const event = module;
                        this.events.set(event.name, event);
                        const { caller } = this.getEventParams(this, event.name);
                        this.on(caller, (...params) => {
                            let pinguEventStuff = this.getEventParams(this, event.name, ...params);
                            this.handleEvent(event.name, ...pinguEventStuff.args);
                        });
                    }
                    else if (type == 'command')
                        this.commands.set(module.name, module);
                    else
                        PinguLibrary_1.errorLog(this, `"${type}" was not recognized!`);
                }
                else if (file.endsWith('.png') || file.toLowerCase().includes('archived'))
                    continue;
                else
                    this.HandlePath(`${path}/${file}`, type);
            }
            catch (err) {
                PinguLibrary_1.DanhoDM(`"${file}" threw an exception:\n${err.message}\n${err.stack}\n`);
            }
        }
    }
    handleEvent(caller, ...args) {
        if (this.subscribedEvents.find(e => e == caller))
            handlers_1.HandleMusicEvent(caller, this, this.events.get(caller).path, ...args);
        return this;
    }
    getEventParams(client, caller, ...args) {
        switch (caller) {
            case 'ready':
            case 'onready': return { caller: (caller == 'onready' ? 'ready' : caller), args: [client] };
            case 'debug':
            case 'ondebug': return { caller: (caller == 'ondebug' ? 'debug' : caller), args: [client] };
            default: return { caller: caller, args: args };
        }
    }
}
exports.PinguMusicClient = PinguMusicClient;
PinguMusicClient.Clients = BasePinguClient_1.Clients;
exports.default = PinguMusicClient;
