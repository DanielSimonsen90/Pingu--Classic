import { Client, ClientEvents, ClientOptions, Collection, Snowflake, TextChannel } from "discord.js";
import PinguClient from "./PinguClient";

export function ToPinguMusicClient(client: Client): PinguMusicClient {
    return client as PinguMusicClient;
}

import { PinguClientEvents, PinguMusicCommand, PinguMusicClientEvents, PinguMusicEvent, PinguMusicCommandParams, HandleMusicEvent } from '../handlers';
import IConfigRequirements from '../../helpers/Config';
import Queue from "../guild/items/music/Queue/Queue";

import { DanhoDM, errorLog } from "../library/PinguLibrary";
import Song from "../guild/items/music/Song";
import BasePinguClient from "./BasePinguClient";

interface VideoThing { url: string }

import fs = require('fs');
import PinguHandler from "../handlers/PinguHandler";

export class PinguMusicClient extends BasePinguClient<PinguClientEvents> {
    //#region Statics
    public static ToPinguMusicClient(client: Client) { return ToPinguMusicClient(client); }
    //#endregion 

    constructor(config: IConfigRequirements, subscribedEvents: [keyof PinguMusicClientEvents], commandsPath?: string, eventsPath?: string, options?: ClientOptions) {
        super(config, subscribedEvents as any, commandsPath, eventsPath, options);
    }

    public queues = new Collection<Snowflake, Queue>();
    public events: Collection<keyof PinguMusicClientEvents, PinguMusicEvent<keyof PinguMusicClientEvents>>;
    public commands: Collection<string, PinguMusicCommand>;
    public subscribedEvents: Array<keyof PinguMusicClientEvents>;

    public emit<PMCE extends keyof PinguMusicClientEvents, CE extends keyof ClientEvents>(key: PMCE, ...args: PinguMusicClientEvents[PMCE]) {
        console.log(typeof key);

        return super.emit(
            key as unknown as CE, 
            ...args as unknown as PinguClientEvents[CE]
        );
    }

    public async getVideo(params: PinguMusicCommandParams, url: string, searchType: 'video' | 'playlist', youTube: any, ytdl: any): Promise<VideoThing> {
        const { client, message, args, voiceChannel } = params;
        let { queue } = params;

        try {
            var video = await youTube.getVideo(url)
        } catch (convErr) {
            if (!convErr.message.includes(`No video ID found in URL:`))
                errorLog(client, `URL failed`, message.content, convErr, {
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
                        queue.connection = await voiceChannel.join();
                        client.emit('play', queue, message, queue.songs[0]);
                        return null;
                    }
                }
            } catch (err) {
                if (err.message == "Cannot read property 'id' of undefined") {
                    await message.channel.send(`I couldn't find that!`);
                    return null;
                }

                await errorLog(client, `Search failed`, message.content, err, {
                    params: { message, args, voiceChannel, queue },
                    additional: { searchType, url },
                    trycatch: { searchResultVideos, video, playlist, playlistVideos, ytdlCoreVideos }
                });
                return null;
            }
        }
    }

    protected HandlePath(path: string, type: 'command' | 'event') {
        let collection = fs.readdirSync(path);
        for (const file of collection) {
            try {
                if (file.endsWith('.js')) {
                    let module = require(`../../../../../${path}/${file}`) as PinguHandler;
                    module.path = `${path.substring(1, path.length)}/${file}`;

                    if (type == 'event') {
                        if (!module.name || !this.subscribedEvents.find(e => module.name as keyof PinguMusicClientEvents == e)) continue;

                        const type = module.name as keyof PinguMusicClientEvents;
                        const event = module as PinguMusicEvent<typeof type>;

                        this.events.set(event.name, event);

                        const { caller } = this.getEventParams(this, event.name);
                        this.on(caller as keyof ClientEvents, (...params) => {
                            let pinguEventStuff = this.getEventParams(this, event.name, ...params);
                            this.handleEvent(event.name, ...pinguEventStuff.args);
                        });
                    }
                    else if (type == 'command') this.commands.set(module.name, module as PinguMusicCommand);
                    else errorLog(this, `"${type}" was not recognized!`);
                }
                else if (file.endsWith('.png') || file.toLowerCase().includes('archived')) continue;
                else this.HandlePath(`${path}/${file}`, type);
            } catch (err) {
                DanhoDM(`"${file}" threw an exception:\n${err.message}\n${err.stack}\n`);
            }
        }
    }
    protected handleEvent<EventType extends keyof PinguMusicClientEvents>(caller: EventType, ...args: PinguMusicClientEvents[EventType]) {
        if (this.subscribedEvents.find(e => e == caller))
            HandleMusicEvent(caller, this, this.events.get(caller).path, ...args);
        return this;
    }
    private getEventParams<EventType extends keyof PinguMusicClientEvents>(client: PinguMusicClient, caller: EventType, ...args: PinguMusicClientEvents[EventType]) {
        switch (caller) {
            case 'ready': case 'onready': return { caller: (caller == 'onready' ? 'ready' : caller) as EventType, args: [client] as unknown as PinguMusicClientEvents[EventType] }
            case 'debug': case 'ondebug': return { caller: (caller == 'ondebug' ? 'debug' : caller) as EventType, args: [client] as unknown as PinguMusicClientEvents[EventType] }
            default: return { caller: caller as EventType, args: args as PinguMusicClientEvents[EventType] };
        }
    }
}

export default PinguMusicClient;