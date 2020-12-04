import { GuildMember, Guild, Role, Message, TextChannel, VoiceChannel, VoiceConnection, Client, PermissionString, User, MessageEmbed, Channel, GuildChannel, GuildEmoji, Presence, ActivityOptions } from 'discord.js';
import { videoInfo } from 'ytdl-core';
const fs = require('fs');

//var lock = new AsyncLock();

class Error {
    constructor(err: { message: string, stack: string, fileName: string, lineNumber: string }) {
        this.message = err.message;
        this.stack = err.stack;
        this.fileName = err.fileName;
        this.lineNumber = err.lineNumber;
    }

    public message: string
    public stack: string
    public fileName: string
    public lineNumber: string
}

//#region Custom Pingu classes
export class PGuildMember {
    constructor(member: GuildMember) {
        this.id = member.id;
        this.user = member.user.tag;
    }
    public id: string
    public user: string
    public toString() {
        return `<@${this.id}>`;
    }
}
export class PRole {
    constructor(role: Role) {
        try {
            this.name = role.name;
            this.id = role.id;
        } catch { return undefined; }
    }
    public name: string;
    public id: string;
}
export class PChannel {
    constructor(channel: GuildChannel) {
        this.id = channel.id;
        this.name = channel.name;
    }
    public id: string
    public name: string
}
export class PEmote {
    constructor(emote: GuildEmoji) {
    }
}
export class PClient {
    constructor(client: Client, guild: Guild) {
        this.displayName = guild.me.displayName;
    }
    public displayName: string
}
export class PinguGuild {
    //#region Static PinguGuild methods
    public static GetPGuilds(): PinguGuild[] {
        return require('./guilds.json');
    }
    public static GetPGuild(guild: Guild): PinguGuild {
        var result = this.GetPGuilds().find(pg => pg.guildID == guild.id);
        if (!result) PinguLibrary.errorLog(guild.client, `Unable to find a guild in pGuilds with id ${guild.id}`);
        return result;
    }
    public static UpdatePGuildsJSON(client: Client, script: string, succMsg: string, errMsg: string) {
        //lock.acquire('key', () => {
        fs.writeFile('./guilds.json', '', err => {
            if (err) PinguLibrary.pGuildLog(client, script, `[writeFile]: ${errMsg}`, err);
            else fs.appendFile('./guilds.json', JSON.stringify(this.GetPGuilds(), null, 4), err => {
                if (err) PinguLibrary.pGuildLog(client, script, `[appendFile]: ${errMsg}`, err);
                else PinguLibrary.pGuildLog(client, script, succMsg);
            });
        });
        //});
    }
    public static async UpdatePGuildsJSONAsync(client: Client, script: string, succMsg: string, errMsg: string) {
        this.UpdatePGuildsJSON(client, script, succMsg, errMsg);
    }
    //#endregion

    constructor(guild: Guild) {
        this.guildName = guild.name;
        this.guildID = guild.id;
        this.guildOwner = new PGuildMember(guild.owner);
        const { Prefix } = require('./config.json');
        this.botPrefix = Prefix;
        this.embedColor = 0;
        this.musicQueue = null;
        this.giveawayConfig = new GiveawayConfig();
        this.pollConfig = new PollConfig;
        this.suggestions = new Array<Suggestion>();
        if (guild.id == '405763731079823380')
            this.themeWinners = new Array<PGuildMember>();
    }
    public guildName: string
    public guildID: string
    public guildOwner: PGuildMember
    public embedColor: number
    public botPrefix: string
    public musicQueue: PQueue
    public giveawayConfig: GiveawayConfig
    public pollConfig: PollConfig
    public suggestions: Suggestion[]
    public themeWinners: PGuildMember[]
}

export class PinguLibrary {
    public static setActivity(client: Client) {
        //return client.user.setActivity('your screams for *help', { type: 'LISTENING' });
        return client.user.setActivity('jingle bells... *help', { type: 'LISTENING' });
    }

    public static PermissionCheck(message: Message, permissions: PermissionString[]) {
        var textChannel = message.channel as TextChannel;

        for (var x = 0; x < permissions.length; x++) {
            var permString = permissions[x].toString().toLowerCase().replace('_', ' ');

            if (!textChannel.permissionsFor(message.client.user).has(permissions[x]))
                return `I don't have permission to **${permString}** in ${textChannel.name}.`;
            else if (!textChannel.permissionsFor(message.author).has(permissions[x]))
                return `<@${message.author.id}> you don't have permission to **${permString}** in #${textChannel.name}.`;
        }
        return this.PermissionGranted;
    }
    public static readonly PermissionGranted: "Permission Granted";

    public static readonly SavedServers = {
        DanhoMisc(client: Client) {
            return PinguLibrary.getServer(client, '460926327269359626');
        },
        PinguSupport(client: Client) {
            return PinguLibrary.getServer(client, '756383096646926376');
        },
    }
    private static getServer(client: Client, id: string) {
        return client.guilds.cache.find(g => g.id == id);
    }

    private static readonly PinguDevelopers: string[] = [
        '245572699894710272', //Danho#2105
        '405331883157880846', //Synthy Sytro
        '290131910091603968', //Slothman
    ];
    public static isPinguDev(user: User) {
        //console.log(`[${this.PinguDevelopers.join(', ')}].includes(${user.id})`);
        return this.PinguDevelopers.includes(user.id);
    }

    private static getChannel(client: Client, guildID: string, channelname: string) {
        var guild = client.guilds.cache.find(guild => guild.id == guildID);
        if (!guild) {
            console.error(`Unable to get guild from ${guildID}`);
            return null;
        }
        var channel = guild.channels.cache.find(channel => channel.name == channelname);
        if (!channel) {
            console.error(`Unable to get channel from ${channelname}`);
            return null;
        }
        return channel as TextChannel;
    }
    public static outages(client: Client, message: string) {
        var outageChannel = this.getChannel(client, '756383096646926376', 'outages');
        if (!outageChannel) return this.DanhoDM(client, `Couldn't get #outage channel in Pingu Support, https://discord.gg/Mp4CH8eftv`);
        console.log(message);
        return outageChannel.send(message);
    }
    public static errorLog(client: Client, message: string, userContent?: string, err?: Error) {
        var errorlogChannel = this.getChannel(client, this.SavedServers.PinguSupport(client).id, 'error-log');
        if (!errorlogChannel) return this.DanhoDM(client, 'Unable to find #error-log in Pingu Support');

        console.error(getErrorMessage(message.includes('`') ? message.replace('`', ' ') : message, userContent, err));
        return errorlogChannel.send(getErrorMessage(message, userContent, err));

        function getErrorMessage(message: string, userContent?: string, err?: Error) {
            if (!userContent) return message;
            else if (!err)
                return (
                    `[Provided Message]\n` +
                    `${message}\n` +
                    `\n` +
                    `[Message content]\n` +
                    `${userContent}\n`
                );

            return (
                err.fileName && err.lineNumber ? `${err.fileName} threw an error at line ${err.lineNumber}!\n` : "" +
                    `[Provided Message]\n` +
                    `${message}\n` +
                    `\n` +
                    `[Message content]\n` +
                    `${userContent}\n` +
                    `\n` +
                    `[Error message]: \n` +
                    `${err.message}\n` +
                    `\n` +
                    `[Stack]\n` +
                    `${err.stack}\n\n`
            );
        }
    }
    public static tellLog(client: Client, sender: User, reciever: User, message: Message | MessageEmbed) {
        var tellLogChannel = this.getChannel(client, this.SavedServers.PinguSupport(client).id, 'tell-log');
        if (!tellLogChannel) return this.DanhoDM(client, `Couldn't get #tell-log channel in Pingu Support, https://discord.gg/Mp4CH8eftv`)

        if ((message as object).constructor.name == "Message") {
            var messageAsMessage = message as Message;
            var consoleLog =
                messageAsMessage.content ?
                    `${sender.username} sent a message to ${reciever.username} saying ` :
                    messageAsMessage.attachments.array().length == 1 ?
                        `${sender.username} sent a file to ${reciever.username}` :
                        messageAsMessage.attachments.array().length > 1 ?
                            `${sender.username} sent ${messageAsMessage.attachments.array().length} files to ${reciever.username}` :
                            `${sender.username} sent something unknown to ${reciever.username}!`;

            if (messageAsMessage.content) consoleLog += messageAsMessage.content;
            if (messageAsMessage.attachments) consoleLog += messageAsMessage.attachments.map(a => `\n${a.url}`);

            console.log(consoleLog);

            var format = (ping) => `${new Date(Date.now()).toLocaleTimeString()} [<@${(ping ? sender : sender.username)}> => <@${(ping ? reciever : reciever.username)}>]`;

            if (messageAsMessage.content && messageAsMessage.attachments)
                tellLogChannel.send(format(false) + `: ||${messageAsMessage.content}||`, messageAsMessage.attachments.array())
                    .then(sent => sent.edit(format(true) + `: ||${messageAsMessage.content}||`));

            else if (messageAsMessage.content)
                tellLogChannel.send(format(false) + `: ||${messageAsMessage.content}||`)
                    .then(sent => sent.edit(format(true) + `: ||${messageAsMessage.content}||`));

            else if (messageAsMessage.attachments)
                tellLogChannel.send(format(false), messageAsMessage.attachments.array())
                    .then(sent => sent.edit(format(true)));

            else this.errorLog(client, `${sender} => ${reciever} sent something that didn't have content or attachments`)
                .then(() => tellLogChannel.send(`Ran else statement - reported to ${tellLogChannel.guild.channels.cache.find(c => c.name == 'error-log')}`));
        }
        else if ((message as MessageEmbed).constructor.name == "MessageEmbed") {
            console.log(`The link between ${sender.username} & ${reciever.username} was unset.`);
            tellLogChannel.send(message as MessageEmbed)
        }
    }
    public static async pGuildLog(client: Client, script: string, message: string, err?: Error) {
        var pinguGuildLog = this.getChannel(client, this.SavedServers.PinguSupport(client).id, "pingu-guild-log");

        if (err) {
            var errorLink = (await this.errorLog(client, `pGuild Error: "${message}"`, null, err)).url;
            return pinguGuildLog.send(`[**Failed**] [**${script}**]: ${message}\n${err.message}\n\n${errorLink}\n\n<@&756383446871310399>`);
        }
        return pinguGuildLog.send(`[**Success**] [**${script}**] ${message}`);
    }
    public static async DanhoDM(client: Client, message: string) {
        console.error(message);

        var DanhoMisc = this.SavedServers.DanhoMisc(client);
        if (!DanhoMisc) {
            console.error('Unable to find Danho Misc guild!', client.guilds.cache.array().forEach(g => console.log(`[${g.id}] ${g.name}`)));
            return null;
        }
        var DanhoDM = await DanhoMisc.owner.createDM();
        return DanhoDM.send(message)
    }

}
//#endregion

abstract class Decidable {
    constructor(value: string, id: string, author: PGuildMember, channel: Channel) {
        this.value = value;
        this.id = id;
        this.author = author;
        this.channel = channel;
    }
    public value: string
    public id: string
    public author: PGuildMember
    public channel: Channel
}

//#region extends Decideables
export class Poll extends Decidable {
    public YesVotes: number
    public NoVotes: number
    public approved: string
    public Decide(yesVotes: number, noVotes: number) {
        this.YesVotes = yesVotes;
        this.NoVotes = noVotes;
        this.approved =
            this.YesVotes > this.NoVotes ? 'Yes' :
                this.NoVotes > this.YesVotes ? 'No' : 'Undecided';
    }
}
export class Giveaway extends Decidable {
    constructor(value: string, id: string, author: PGuildMember, channel: Channel) {
        super(value, id, author, channel);
        this.winners = new Array<PGuildMember>();
    }
    public winners: PGuildMember[]
}
export class Suggestion extends Decidable {
    public Decide(approved: boolean, decidedBy: PGuildMember) {
        this.approved = approved;
        this.decidedBy = decidedBy;
    }
    public decidedBy: PGuildMember
    public approved: boolean
}
//#endregion

interface IDecidableConfigOptions {
    firstTimeExecuted: boolean;
    channel: Channel;
}

//#region PollConfig
interface IPollConfigOptions extends IDecidableConfigOptions {
    pollRole: PRole;
    polls: Poll[];
}
export class PollConfig implements IPollConfigOptions {
    constructor(options?: IPollConfigOptions) {
        this.firstTimeExecuted = options ? options.firstTimeExecuted : true;
        this.pollRole = options ? options.pollRole : undefined;
        this.channel = options ? options.channel : undefined;
        if (options) this.polls = options.polls;
    }
    firstTimeExecuted: boolean;
    pollRole: PRole;
    polls: Poll[];
    channel: Channel;
}
//#endregion

//#region GiveawayConfig
interface IGiveawayConfigOptions extends IDecidableConfigOptions {
    allowSameWinner: boolean;
    hostRole: PRole;
    winnerRole: PRole;
    giveaways: Giveaway[];
}
export class GiveawayConfig implements IGiveawayConfigOptions {
    constructor(options?: IGiveawayConfigOptions) {
        this.firstTimeExecuted = options ? options.firstTimeExecuted : true;
        this.allowSameWinner = options ? options.allowSameWinner : undefined;
        this.hostRole = options ? options.hostRole : undefined;
        this.winnerRole = options ? options.winnerRole : undefined;
        this.channel = options ? options.channel : undefined;
        if (options) this.giveaways = options.giveaways;
    }
    firstTimeExecuted: boolean;
    allowSameWinner: boolean;
    hostRole: PRole;
    winnerRole: PRole;
    giveaways: Giveaway[];
    channel: Channel;
}
export class TimeLeftObject {
    constructor(Now: Date, EndsAt: Date) {
        /*
        console.clear();
        console.log(`EndsAt: ${EndsAt.getDate()}d ${EndsAt.getHours()}h ${EndsAt.getMinutes()}m ${EndsAt.getSeconds()}s`)
        console.log(`Now: ${Now.getDate()}d ${Now.getHours()}h ${Now.getMinutes()}m ${Now.getSeconds()}s`)
        console.log(`this.days = Math.round(${EndsAt.getDate()} - ${Now.getDate()})`)
        console.log(`this.hours = Math.round(${EndsAt.getHours()} - ${Now.getHours()})`)
        console.log(`this.minutes = Math.round(${EndsAt.getMinutes()} - ${Now.getMinutes()})`)
        console.log(`this.seconds = Math.round(${EndsAt.getSeconds()} - ${Now.getSeconds()})`)
        */

        const Minutes = this.includesMinus(Math.round(EndsAt.getSeconds() - Now.getSeconds()), 60, EndsAt.getMinutes(), Now.getMinutes());
        const Hours = this.includesMinus(Minutes[0], 60, EndsAt.getHours(), Now.getHours());
        const Days = this.includesMinus(Hours[0], 24, EndsAt.getDate(), Now.getDate());

        this.seconds = Minutes[1];
        this.minutes = Hours[1];
        this.hours = Days[1];
        this.days = Days[0];
    }
    public days: number;
    public hours: number;
    public minutes: number;
    public seconds: number;

    /**Minus check, cus sometimes preprop goes to minus, while preprop isn't being subtracted
     * @param preprop Previous property, for this.minutes, this would be this.seconds
     * @param maxPreProp Max number preprop can be, everything is 60 but this.hours is 24
     * @param EndsAt EndsAt variable
     * @param Now Now variable*/
    private includesMinus(preprop: number, maxPreProp: number, EndsAt: number, Now: number) {
        const returnValue = Math.round(EndsAt - Now);
        if (preprop.toString().includes('-')) {
            preprop = maxPreProp + preprop;
            return [returnValue - 1, preprop];
        }
        return [returnValue, preprop];
    }
    public toString() {
        //console.log(`${this.days}d ${this.hours}h ${this.minutes}m ${this.seconds}s`);
        let returnMsg = '';
        const times = [this.days, this.hours, this.minutes, this.seconds],
            timeMsg = ["day", "hour", "minute", "second"];

        for (var i = 0; i < times.length; i++)
            if (times[i] > 0) {
                returnMsg += `**${times[i]}** ${timeMsg[i]}`;
                if (times[i] != 1) returnMsg += 's';
                returnMsg += `, `;
            }
        return returnMsg.substring(0, returnMsg.length - 2);
    }
}
//#endregion

//#region Music
export class Queue {
    constructor(client: PClient, logChannel: TextChannel, voiceChannel: VoiceChannel, songs: Song[], playing = true) {
        this.logChannel = logChannel;
        this.voiceChannel = voiceChannel;
        this.songs = songs;
        this.volume = .5;
        this.connection = null;
        this.playing = playing;
        this.client = client;
    }
    public logChannel: TextChannel
    public voiceChannel: VoiceChannel
    public connection: VoiceConnection
    public songs: Song[]
    public volume: number
    public playing: boolean
    public client: PClient

    /** Adds song to the start of the queue
     * @param song song to add*/
    public addFirst(song: Song) {
        this.songs.unshift(song);
    }
    /** Adds song to queue
     * @param song song to add*/
    public add(...songs: Song[]) {
        songs.forEach(song => this.songs.push(song));
    }
    /** Removes song from queue
     * @param song song to remove*/
    public remove(song: Song) {
        this.songs = this.songs.filter(s => s != song);
    }
    public move(posA: number, posB: number) {
        var songToMove = this.songs[posA];
        this.songs.unshift(null);

        for (var i = 1; i < this.songs.length; i++) {
            if (i == posB) this.songs[i - 1] = songToMove;
            else if (i == posA + 1) continue;
            else this.songs[i - 1] = this.songs[i];
        }
        return this;
    }
}
export class PQueue {
    constructor(queue: Queue) {
        this.logChannel = new PChannel(queue.logChannel);
        this.voiceChannel = new PChannel(queue.voiceChannel);
        this.connection = queue.connection.voice.speaking;
        this.songs = queue.songs;
        this.volume = queue.volume;
        this.client = queue.client;
        this.playing = queue.playing
    }
    public logChannel: PChannel
    public voiceChannel: PChannel
    public client: PClient
    public connection: boolean
    public songs: Song[]
    public volume: number
    public playing: boolean
}
export class Song {
    constructor(videoInfo: videoInfo, author: User) {
        var info = videoInfo.videoDetails;
        this.link = info.video_url;
        this.title = info.title;
        this.author = info.author.name;
        this.length = this.GetLength(info.lengthSeconds);
        this.endsAt = new Date(Date.now() + parseInt(info.lengthSeconds));
        this.requestedBy = author;
    }
    public title: string
    public author: string
    public link: string
    public playing: boolean
    public length: string
    public endsAt: Date
    public requestedBy: User

    public getTimeLeft() {
        return new TimeLeftObject(new Date(Date.now()), this.endsAt);
    }
    private GetLength(secondsLength: string) {
        var seconds = parseInt(secondsLength), minutes = 0, hours = 0, final = [];

        if (seconds > 59) {
            while (seconds > 59) {
                seconds -= 60;
                minutes++;
            }
        }
        if (minutes > 59) {
            while (minutes > 59) {
                minutes -= 60;
                hours++;
            }
        }

        final.push(hours, minutes, seconds);

        return final.map(i => i < 10 ? `0${i}` : i).join('.');
    }
}
//#endregion