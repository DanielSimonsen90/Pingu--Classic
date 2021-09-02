import { ClientEvents, Collection, Snowflake, TextChannel } from "discord.js";
import * as fs from 'fs';

import PinguHandler from "../handlers/PinguHandler";
import PinguMusicCommand, { PinguMusicCommandParams } from '../handlers/PinguMusicCommand';
import PinguMusicEvent, { PinguMusicClientEvents, HandleMusicEvent } from '../handlers/PinguMusicEvent';
import { PinguMusicIntentEvents } from '../../helpers/IntentEvents';

import Queue from "../guild/items/music/Queue/Queue";
import Song from "../guild/items/music/Song";

import PinguClientBase from "./BasePinguClient";

interface VideoThing { url: string }

export class PinguMusicClient extends PinguClientBase<PinguMusicIntentEvents> {
    public queues = new Collection<Snowflake, Queue>();
    public declare events: Collection<keyof PinguMusicIntentEvents, PinguMusicEvent<keyof PinguMusicClientEvents>>;
    public declare commands: Collection<string, PinguMusicCommand>;
    // public declare subscribedEvents: Array<PinguMusicCommand[keyof PinguMusicCommand]>;

    public emit<PMCE extends keyof PinguMusicClientEvents, CE extends keyof ClientEvents>(key: PMCE, ...args: PinguMusicClientEvents[PMCE]) {
        console.log(typeof key);

        return super.emit(
            key as unknown as CE, 
            ...args as unknown as PinguMusicClientEvents[CE]
        );
    }

    public async getVideo(params: PinguMusicCommandParams, url: string, searchType: 'video' | 'playlist', youTube: any, ytdl: any): Promise<VideoThing> {
        const { client, message, args, voiceChannel } = params;
        let { queue } = params;

        try {
            var video = await youTube.getVideo(url)
        } catch (convErr) {
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
                    var searchResultVideos = await youTube.searchPlaylists(`"${url}"`, 1, { type: 'playlist' })
                    var playlist = await youTube.getPlaylistByID(searchResultVideos[0].id);
                    var playlistVideos = await playlist.getVideos();
                    var ytdlCoreVideos = playlistVideos.map(v => ytdl.getInfo(v.url));

                    let songs = [];
                    for (var i = 0; i < ytdlCoreVideos.length; i++) {
                        let song = new Song(message.author, await ytdlCoreVideos[i]);
                        songs.push(song);
                    }

                    if (queue) { 
                        queue.add(...songs);

                        await Promise.all([
                            queue.Update(message, "HandlePlay",
                                `Playlist was added to queue`
                            ),
                            queue.AnnounceMessage(message,
                                `Added **${playlist.title}** to the queue!`,
                                `${message.author.username} added **${playlist.title}** (playlist) to the queue.`
                            )
                        ])

                        return null;
                    }
                    else {
                        queue = new Queue(message.channel as TextChannel, voiceChannel, songs);
                        queue.connection = queue.voiceChannel.join();
                        client.emit('play', queue, message, queue.songs[0]);
                        return null;
                    }
                }
            } catch (err) {
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

    protected handlePath(path: string, type: 'command' | 'event') {
        if (!path) return;

        const files = fs.readdirSync(path);
        for (const file of files) {
            try {
                if (file.endsWith('.js')) {
                    let module = require(`${path}/${file}`) as PinguHandler;
                    module.path = `${path.substring(1, path.length)}/${file}`;

                    if (type == 'event') {
                        if (!module.name || !this.subscribedEvents.find(e => module.name as keyof PinguMusicClientEvents == e)) continue;

                        const type = module.name as keyof PinguMusicClientEvents;
                        const event = module as PinguMusicEvent<typeof type>;

                        this.events.set(event.name as keyof PinguMusicIntentEvents, event);

                        this.on(event.name as keyof ClientEvents, (...params) => {
                            this.handleEvent(event.name, ...params);
                        });
                    }
                    else if (type == 'command') this.commands.set(module.name, module as PinguMusicCommand);
                    else this.log('error', `"${type}" was not recognized!`);
                }
                else if (file.endsWith('.png') || file.toLowerCase().includes('archived')) continue;
                else this.handlePath(`${path}/${file}`, type);
            } catch (err) {
                this.DanhoDM(`"${file}" threw an exception:\n${err.message}\n${err.stack}\n`);
            }
        }
    }
    protected handleEvent<EventType extends keyof PinguMusicClientEvents>(caller: EventType, ...args: PinguMusicClientEvents[EventType]) {
        if (this.subscribedEvents.find(e => e == caller))
            HandleMusicEvent(caller, this, this.events.get(caller as keyof PinguMusicIntentEvents).path, ...args);
        return this;
    }
}

export default PinguMusicClient;