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
exports.Queue = void 0;
const discord_js_1 = require("discord.js");
const statics_1 = require("./statics");
class Queue {
    constructor(logChannel, voiceChannel, songs, playing = true) {
        this.logChannel = logChannel;
        this.voiceChannel = voiceChannel;
        this.songs = songs;
        this.volume = 1;
        this.connection = null;
        this.playing = playing;
        this.loop = false;
        this.index = 0;
    }
    static get(guildID) { return statics_1.get(guildID); }
    static set(guildID, queue) { return statics_1.set(guildID, queue); }
    get currentSong() { return this.songs[this.index]; }
    /** Adds song to the start of the queue
     * @param song song to add*/
    addFirst(song) {
        song._id = this.songs.length;
        this.songs.unshift(song);
    }
    /** Adds song to queue
     * @param song song to add*/
    add(...songs) {
        songs.forEach(song => {
            song._id = this.songs.length;
            this.songs.push(song);
        });
    }
    /** Removes song from queue
     * @param song song to remove*/
    remove(song) {
        this.songs = this.songs.filter(s => s != song);
    }
    move(posA, posB) {
        var songToMove = this.songs[posA - 1];
        this.songs.unshift(null);
        for (var i = 1; i < this.songs.length; i++) {
            if (i == posB) {
                this.songs[i - 1] = songToMove;
                break;
            }
            else if (i == posA + 1)
                continue;
            else
                this.songs[i - 1] = this.songs[i];
        }
        this.songs.splice(this.songs.length - 1);
        return this;
    }
    includes(title) {
        var song = this.songs.find(s => s.title.includes(title));
        return song != null;
    }
    find(title) {
        return this.songs.find(s => s.title.includes(title));
    }
    pauseResume(message, pauseRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.playing && pauseRequest)
                return message.channel.send(`Music is already paused!`);
            else if (this.playing && !pauseRequest)
                return message.channel.send(`Music is already resumed!`);
            if (!this.connection.dispatcher)
                return message.channel.send(`I'm not playing anything!`);
            if (pauseRequest)
                this.connection.dispatcher.pause();
            else
                this.connection.dispatcher.resume();
            let lastMessage = (yield message.channel.messages.fetch({ after: message.id })).first();
            let react = (msg) => __awaiter(this, void 0, void 0, function* () {
                if (!(msg && msg.embeds[0] && msg.embeds[0].title.startsWith('Now playing:')))
                    return false;
                const { ReactControlPanel } = require('./commands/2 Fun/music');
                yield msg.reactions.removeAll();
                yield ReactControlPanel(msg, this, pauseRequest);
                return true;
            });
            if (!(yield react(lastMessage)))
                yield react(message);
            this.playing = !pauseRequest;
            const PauseOrResume = pauseRequest ? 'Paused' : 'Resumed';
            if (lastMessage && lastMessage.author == message.client.user && (lastMessage.content.includes('Resumed') || lastMessage.content.includes('Paused')))
                return lastMessage.edit(lastMessage.content.includes('by') ?
                    `${PauseOrResume} by ${message.member.displayName}.` :
                    `${PauseOrResume} music.`);
            this.AnnounceMessage(message, `${PauseOrResume} music.`, `${PauseOrResume} by ${message.member.displayName}.`);
        });
    }
    AnnounceMessage(message, senderMsg, logMsg) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.logChannel)
                return message.channel.send(senderMsg);
            if (message.channel != this.logChannel) {
                message.channel.send(senderMsg);
                return this.logChannel.send(logMsg);
            }
            return this.logChannel.send(senderMsg);
        });
    }
    Update(message, commandName, succMsg) {
        return __awaiter(this, void 0, void 0, function* () {
            Queue.set(message.guild.id, ['HandleStop', 'Play'].includes(commandName) ? null : this);
            message.client.log('console', `{**${commandName}**}: ${succMsg}`);
        });
    }
    NowPlayingEmbed(message) {
        return __awaiter(this, void 0, void 0, function* () {
            let { thumbnail, title, requestedBy, endsAt, author, link } = this.currentSong;
            const client = message.client;
            const pGuildClient = client.toPClient(client.pGuilds.get(message.guild));
            return new discord_js_1.MessageEmbed({
                title: `Now playing: ${title} | by ${author}`,
                description: `Requested by <@${requestedBy._id}>`,
                footer: { text: 'Song finished at' },
                thumbnail: { url: thumbnail },
                url: link,
                color: pGuildClient.embedColor || client.DefaultEmbedColor,
                timestamp: endsAt
            });
        });
    }
}
exports.Queue = Queue;
exports.default = Queue;