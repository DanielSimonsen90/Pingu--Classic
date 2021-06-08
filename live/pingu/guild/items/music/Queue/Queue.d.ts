import { Message, MessageEmbed, TextChannel, VoiceChannel, VoiceConnection } from "discord.js";
import IMuisc from "../IMusic";
import Song from '../Song';
export declare class Queue implements IMuisc {
    static get(guildID: string): Queue;
    static set(guildID: string, queue: Queue): void;
    constructor(logChannel: TextChannel, voiceChannel: VoiceChannel, songs: Song[], playing?: boolean);
    logChannel: TextChannel;
    voiceChannel: VoiceChannel;
    connection: VoiceConnection;
    songs: Song[];
    index: number;
    volume: number;
    playing: boolean;
    loop: boolean;
    get currentSong(): Song;
    /** Adds song to the start of the queue
     * @param song song to add*/
    addFirst(song: Song): void;
    /** Adds song to queue
     * @param song song to add*/
    add(...songs: Song[]): void;
    /** Removes song from queue
     * @param song song to remove*/
    remove(song: Song): void;
    move(posA: number, posB: number): this;
    includes(title: string): boolean;
    find(title: string): Song;
    pauseResume(message: Message, pauseRequest: boolean): Promise<Message>;
    AnnounceMessage(message: Message, senderMsg: string, logMsg: string): Promise<Message>;
    Update(message: Message, commandName: string, succMsg: string): Promise<void>;
    NowPlayingEmbed(message: Message): Promise<MessageEmbed>;
}
export default Queue;
