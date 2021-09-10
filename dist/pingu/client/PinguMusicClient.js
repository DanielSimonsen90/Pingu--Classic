"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PinguMusicClient = void 0;
const discord_js_1 = require("discord.js");
const fs = require("fs");
const PinguMusicEvent_1 = require("../handlers/Music/PinguMusicEvent");
const Queue_1 = require("../guild/items/music/Queue/Queue");
const Song_1 = require("../guild/items/music/Song");
const PinguClientBase_1 = require("./PinguClientBase");
class PinguMusicClient extends PinguClientBase_1.default {
    queues = new discord_js_1.Collection();
    emit(key, ...args) {
        console.log(typeof key);
        return super.emit(key, ...args);
    }
    async getVideo(params, url, searchType, youTube, ytdl) {
        const { client, message, args, voiceChannel } = params;
        let { queue } = params;
        try {
            var video = await youTube.getVideo(url);
        }
        catch (convErr) {
            if (!convErr.message.includes(`No video ID found in URL:`))
                client.log('error', `URL failed`, message.content, convErr, {
                    params: { message, args, voiceChannel, queue },
                    additional: { searchType, url },
                    trycatch: { video }
                });
            try {
                if (searchType == 'video') {
                    var searchResultVideos = await youTube.searchVideos(url, 1);
                    video = await youTube.getVideoByID(searchResultVideos[0].id);
                }
                else {
                    var searchResultVideos = await youTube.searchPlaylists(`"${url}"`, 1, { type: 'playlist' });
                    var playlist = await youTube.getPlaylistByID(searchResultVideos[0].id);
                    var playlistVideos = await playlist.getVideos();
                    var ytdlCoreVideos = playlistVideos.map(v => ytdl.getInfo(v.url));
                    let songs = [];
                    for (var i = 0; i < ytdlCoreVideos.length; i++) {
                        let song = new Song_1.default(message.author, await ytdlCoreVideos[i]);
                        songs.push(song);
                    }
                    if (queue) {
                        queue.add(...songs);
                        await Promise.all([
                            queue.Update(message, "HandlePlay", `Playlist was added to queue`),
                            queue.AnnounceMessage(message, `Added **${playlist.title}** to the queue!`, `${message.author.username} added **${playlist.title}** (playlist) to the queue.`)
                        ]);
                        return null;
                    }
                    else {
                        queue = new Queue_1.default(message.channel, voiceChannel, songs);
                        queue.connection = queue.voiceChannel.join();
                        client.emit('play', queue, message, queue.songs[0]);
                        return null;
                    }
                }
            }
            catch (err) {
                if (err.message == "Cannot read property 'id' of undefined") {
                    await message.channel.send(`I couldn't find that!`);
                    return null;
                }
                await client.log('error', `Search failed`, message.content, err, {
                    params: { message, args, voiceChannel, queue },
                    additional: { searchType, url },
                    trycatch: { searchResultVideos, video, playlist, playlistVideos, ytdlCoreVideos }
                });
                return null;
            }
        }
    }
    handlePath(path, type) {
        if (!path)
            return;
        const files = fs.readdirSync(path);
        for (const file of files) {
            try {
                if (file.endsWith('.js')) {
                    let module = require(`${path}/${file}`);
                    module.path = `${path.substring(1, path.length)}/${file}`;
                    if (type == 'event') {
                        if (!module.name || !this.subscribedEvents.find(e => module.name == e))
                            continue;
                        const type = module.name;
                        const event = module;
                        this.events.set(event.name, event);
                        this.on(event.name, (...params) => {
                            this.handleEvent(event.name, ...params);
                        });
                    }
                    else if (type == 'command')
                        this.commands.set(module.name, module);
                    else
                        this.log('error', `"${type}" was not recognized!`);
                }
                else if (file.endsWith('.png') || file.toLowerCase().includes('archived'))
                    continue;
                else
                    this.handlePath(`${path}/${file}`, type);
            }
            catch (err) {
                this.DanhoDM(`"${file}" threw an exception:\n${err.message}\n${err.stack}\n`);
            }
        }
    }
    handleEvent(caller, ...args) {
        if (this.subscribedEvents.find(e => e == caller))
            PinguMusicEvent_1.HandleMusicEvent(caller, this, ...args);
        return this;
    }
}
exports.PinguMusicClient = PinguMusicClient;
exports.default = PinguMusicClient;
