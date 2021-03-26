import { Message, MessageEmbed, TextChannel, VoiceChannel, VoiceConnection } from "discord.js";

import { consoleLog } from "../../../../library/PinguLibrary";

import { PinguClient } from '../../../../client/PinguClient';
import { GetPGuild } from '../../../PinguGuild';

import { IMuisc } from "../IMusic";
import { Song } from '../Song';
import { get, set } from './statics';

export class Queue implements IMuisc {
    public static get(guildID: string) {
        return get(guildID);
    }
    public static set(guildID: string, queue: Queue) {
        return set(guildID, queue);
    }

    constructor(logChannel: TextChannel, voiceChannel: VoiceChannel, songs: Song[], playing = true) {
        this.logChannel = logChannel;
        this.voiceChannel = voiceChannel;
        this.songs = songs;
        this.volume = 1;
        this.connection = null;
        this.playing = playing;
        this.loop = false;
        this.index = 0;
    }

    public logChannel: TextChannel
    public voiceChannel: VoiceChannel
    public connection: VoiceConnection
    public songs: Song[]
    public index: number
    public volume: number
    public playing: boolean
    public loop: boolean

    public get currentSong() {
        return this.songs[this.index];
    }

    /** Adds song to the start of the queue
     * @param song song to add*/
    public addFirst(song: Song) {
        song._id = this.songs.length;
        this.songs.unshift(song);
    }
    /** Adds song to queue
     * @param song song to add*/
    public add(...songs: Song[]) {
        songs.forEach(song => {
            song._id = this.songs.length;
            this.songs.push(song)
        });
    }
    /** Removes song from queue
     * @param song song to remove*/
    public remove(song: Song) {
        this.songs = this.songs.filter(s => s != song);
    }
    public move(posA: number, posB: number) {
        var songToMove = this.songs[posA - 1];
        this.songs.unshift(null);

        for (var i = 1; i < this.songs.length; i++) {
            if (i == posB) {
                this.songs[i - 1] = songToMove;
                break;
            }
            else if (i == posA + 1) continue;
            else this.songs[i - 1] = this.songs[i];
        }
        this.songs.splice(this.songs.length - 1);
        return this;
    }
    public includes(title: string) {
        var song = this.songs.find(s => s.title.includes(title))
        return song != null;
    }
    public find(title: string) {
        return this.songs.find(s => s.title.includes(title));
    }

    public async pauseResume(message: Message, pauseRequest: boolean) {
        if (!this.playing && pauseRequest) return message.channel.send(`Music is already paused!`)
        else if (this.playing && !pauseRequest) return message.channel.send(`Music is already resumed!`)

        if (!this.connection.dispatcher) return message.channel.send(`I'm not playing anything!`);

        if (pauseRequest) this.connection.dispatcher.pause();
        else this.connection.dispatcher.resume();

        let lastMessage = (await message.channel.messages.fetch({ after: message.id })).first();
        let react = async (msg: Message) => {
            if (!(msg && msg.embeds[0] && msg.embeds[0].title.startsWith('Now playing:'))) return false;

            const { ReactControlPanel } = require('./commands/2 Fun/music');

            await msg.reactions.removeAll();
            await ReactControlPanel(msg, this, pauseRequest);
            return true;
        }

        if (!await react(lastMessage)) await react(message);

        this.playing = !pauseRequest;
        const PauseOrResume = pauseRequest ? 'Paused' : 'Resumed';

        if (lastMessage && lastMessage.author == message.client.user && (lastMessage.content.includes('Resumed') || lastMessage.content.includes('Paused')))
            return lastMessage.edit(lastMessage.content.includes('by') ?
                `${PauseOrResume} by ${message.member.displayName}.` :
                `${PauseOrResume} music.`
            );

        this.AnnounceMessage(message,
            `${PauseOrResume} music.`,
            `${PauseOrResume} by ${message.member.displayName}.`
        );
    }
    public async AnnounceMessage(message: Message, senderMsg: string, logMsg: string) {
        if (!this.logChannel) return message.channel.send(senderMsg);

        if (message.channel != this.logChannel) {
            message.channel.send(senderMsg);
            return this.logChannel.send(logMsg);
        }
        return this.logChannel.send(senderMsg);
    }
    public async Update(message: Message, commandName: string, succMsg: string) {
        Queue.set(message.guild.id, ['HandleStop', 'Play'].includes(commandName) ? null : this);

        consoleLog(message.client,
            `{**${commandName}**}: ${succMsg}`
        );
    }
    public async NowPlayingEmbed(message: Message) {
        let { thumbnail, title, requestedBy, endsAt, author, link } = this.currentSong;
        let pGuildClient = PinguClient.ToPinguClient(message.client).toPClient(await GetPGuild(message.guild));

        return new MessageEmbed()
            .setTitle(`Now playing: ${title} | by ${author}`)
            .setDescription(`Requested by <@${requestedBy._id}>`)
            .setFooter(`Song finished at`)
            .setThumbnail(thumbnail)
            .setURL(link)
            .setColor(pGuildClient.embedColor)
            .setTimestamp(endsAt)
    }
}