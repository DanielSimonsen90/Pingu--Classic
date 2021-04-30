import { Client, ClientOptions, Collection, Snowflake, TextChannel } from "discord.js";
import PinguClient from "./PinguClient";

export function ToPinguMusicClient(client: Client): PinguMusicClient {
    return client as PinguClient as PinguMusicClient;
}

import { PinguClientEvents, PinguMusicCommand, PinguMusicClientEvents, PinguMusicEvent, PinguMusicCommandParams, SubscribedEvents } from '../handlers';
import { IConfigRequirements } from '../../helpers/Config';
import Queue from "../guild/items/music/Queue/Queue";

import { errorLog } from "../library/PinguLibrary";
import Song from "../guild/items/music/Song";

type MusicSubscribedEvents = SubscribedEvents | 'PinguMusic';

interface VideoThing { url: string }

export class PinguMusicClient extends PinguClient {
    //#region Statics
    public static ToPinguMusicClient(client: Client) { return ToPinguMusicClient(client); }
    //#endregion 

    constructor(config: IConfigRequirements, subscribedEvents: [keyof PinguMusicClientEvents], commandsPath?: string, eventsPath?: string, options?: ClientOptions) {
        super(config, subscribedEvents as any, commandsPath, eventsPath, options);
    }

    public queues = new Collection<Snowflake, Queue>();
    public events = new Collection<string, PinguMusicEvent<keyof PinguMusicClientEvents, keyof PinguClientEvents>>();
    public commands = new Collection<string, PinguMusicCommand>();
    //public subscribedEvents = new Collection<MusicSubscribedEvents, keyof PinguMusicClientEvents>();

    public emit<PMCE extends keyof PinguMusicClientEvents, PCE extends keyof PinguClientEvents>(key: PMCE, ...args: PinguMusicClientEvents[PMCE]) {
        console.log(typeof key);
        throw Error("NotImplementedException");

        return super.emit(
            key as unknown as PCE, 
            ...args as unknown as PinguClientEvents[PCE]
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
}

export default PinguMusicClient;