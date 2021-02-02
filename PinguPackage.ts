import {
    ActivityType, BitFieldResolvable, Client, Collection,
    Guild, GuildAuditLogsAction, GuildChannel, GuildMember,
    Message, MessageEmbed, MessageReaction, Permissions,
    PermissionString, Role, TextChannel, User, VoiceChannel,
    VoiceConnection
} from 'discord.js';
import { MoreVideoDetails } from 'ytdl-core';
import * as mongoose from 'mongoose';

import * as PinguGuildSchema from './MongoSchemas/PinguGuild';
import * as PinguUserSchema from './MongoSchemas/PinguUser';

export class Error {
    constructor(err: { message: string, stack: string, fileName: string, lineNumber: string } | any) {
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
export class DiscordPermissions {
    public static 'CREATE_INSTANT_INVITE' = 'CREATE_INSTANT_INVITE'
    public static 'KICK_MEMBERS' = 'KICK_MEMBERS'
    public static 'BAN_MEMBERS' = 'BAN_MEMBERS'
    public static 'ADMINISTRATOR' = 'ADMINISTRATOR'
    public static 'MANAGE_CHANNELS' = 'MANAGE_CHANNELS'
    public static 'MANAGE_GUILD' = 'MANAGE_GUILD'
    public static 'ADD_REACTIONS' = 'ADD_REACTIONS'
    public static 'VIEW_AUDIT_LOG' = 'VIEW_AUDIT_LOG'
    public static 'PRIORITY_SPEAKER' = 'PRIORITY_SPEAKER'
    public static 'STREAM' = 'STREAM'
    public static 'VIEW_CHANNEL' = 'VIEW_CHANNEL'
    public static 'SEND_MESSAGES' = 'SEND_MESSAGES'
    public static 'SEND_TTS_MESSAGES' = 'SEND_TTS_MESSAGES'
    public static 'MANAGE_MESSAGES' = 'MANAGE_MESSAGES'
    public static 'EMBED_LINKS' = 'EMBED_LINKS'
    public static 'ATTACH_FILES' = 'ATTACH_FILES'
    public static 'READ_MESSAGE_HISTORY' = 'READ_MESSAGE_HISTORY'
    public static 'MENTION_EVERYONE' = 'MENTION_EVERYONE'
    public static 'USE_EXTERNAL_EMOJIS' = 'USE_EXTERNAL_EMOJIS'
    public static 'VIEW_GUILD_INSIGHTS' = 'VIEW_GUILD_INSIGHTS'
    public static 'CONNECT' = 'CONNECT'
    public static 'SPEAK' = 'SPEAK'
    public static 'MUTE_MEMBERS' = 'MUTE_MEMBERS'
    public static 'DEAFEN_MEMBERS' = 'DEAFEN_MEMBERS'
    public static 'MOVE_MEMBERS' = 'MOVE_MEMBERS'
    public static 'USE_VAD' = 'USE_VAD'
    public static 'CHANGE_NICKNAME' = 'CHANGE_NICKNAME'
    public static 'MANAGE_NICKNAMES' = 'MANAGE_NICKNAMES'
    public static 'MANAGE_ROLES' = 'MANAGE_ROLES'
    public static 'MANAGE_WEBHOOKS' = 'MANAGE_WEBHOOKS'
    public static 'MANAGE_EMOJIS' = 'MANAGE_EMOJIS'
    public static bitOf(value: PermissionString): number {
        return Permissions.resolve(value);
    }
}
class BitPermission {
    constructor(permString: PermissionString | string, bit: number) {
        this.permString = permString;
        this.bit = bit;
    }
    public permString: PermissionString | string
    public bit: number
}

//#region JSON Classes
export class PItem {
    constructor(object: { id: string, name: string }) {
        this.id = object.id;
        this.name = object.name;
    }
    public id: string
    public name: string
}
export class PGuildMember extends PItem {
    constructor(member: GuildMember) {
        super({
            id: member.id,
            name: member.user.tag
        });
    }
    public toString() {
        return `<@${this.id}>`;
    }
}
export class PRole extends PItem {
    constructor(role: Role) {
        try { super(role) }
        catch { return undefined; }
    }
}
export class PChannel extends PItem {
    constructor(channel: GuildChannel) {
        super(channel);
    }
}
export class PUser extends PItem {
    constructor(user: User) {
        super({ id: user.id, name: user.tag });
    }
}
export class PGuild extends PItem {
    constructor(guild: Guild) {
        super(guild);
    }
}
export class PClient {
    constructor(client: Client, guild: Guild) {
        this.id = client.user.id;
        this.displayName = guild.me.displayName;

        let clientIndex = guild.client.user.id == PinguLibrary.Clients.PinguID ? 0 : 1;
        const { Prefix } = require('./config.json');
        this.embedColor = guild.me.roles.cache.find(role => role.managed).color || PinguLibrary.DefaultEmbedColor;
        this.prefix = clientIndex == 1 ? 'b' + Prefix : Prefix;
    }
    public displayName: string
    public embedColor: number
    public prefix: string
    public id: string
}

export class PQueue {
    constructor(queue: Queue) {
        this.logChannel = new PChannel(queue.logChannel);
        this.voiceChannel = new PChannel(queue.voiceChannel);
        this.index = queue.index;
        this.songs = queue.songs;
        this.volume = queue.volume;
        this.client = queue.client;
        this.loop = queue.loop;
        this.playing = queue.playing;
    }

    public logChannel: PChannel
    public voiceChannel: PChannel
    public client: PClient
    public index: number
    public songs: Song[]
    public volume: number
    public playing: boolean
    public loop: boolean;

    public async ToQueue(guild: Guild) {
        let queue = new Queue(
            this.client,
            guild.channels.cache.find(c => c.id == this.logChannel.id) as TextChannel,
            guild.channels.cache.find(c => c.id == this.voiceChannel.id) as VoiceChannel,
            this.songs,
            this.playing
        );
        queue.connection = await queue.voiceChannel.join();
        queue.client.displayName = this.client.displayName;
        queue.volume = this.volume;
        queue.loop = this.loop;
        queue.index = this.index;

        return queue;
    }
}
export class PMarry {
    constructor(marry: Marry) {
        this.partner = marry.partner;
        this.internalDate = marry.internalDate.toString();
    }

    public partner: PUser
    public internalDate: string

    public ToMarry() {
        return new Marry(this.partner, this.internalDate);
    }
}
//#endregion

//#region Custom Pingu classes 
export class PinguUser {
    public static async WritePUser(client: Client, user: User, scriptName: string, succMsg: string, errMsg: string) {
        PinguLibrary.DBExecute(client, async mongoose => {
            let doc = Object.assign({ _id: user.id }, new PinguUser(user));
            let created = await new PinguUserSchema(doc).save();
            if (!created) PinguLibrary.pUserLog(client, scriptName, errMsg);
            else PinguLibrary.pUserLog(client, scriptName, succMsg);
        });
    }
    public static async GetPUser(user: User): Promise<PinguUser> {
        return await PinguUserSchema.findOne({ _id: user.id });
    }
    public static async UpdatePUser(client: Client, updatedProperty: object, pUser: PinguUser, scriptName: string, succMsg: string, errMsg: string): Promise<PinguUser> {
        return await PinguUserSchema.updateOne({ _id: pUser.id }, updatedProperty, null, err => {
            if (err) PinguLibrary.pUserLog(client, scriptName, errMsg, err);
            else PinguLibrary.pUserLog(client, scriptName, succMsg);
        })
    }
    public static async DeletePUser(client: Client, user: User, scriptName: string, succMsg: string, errMsg: string): Promise<PinguUser> {
        return await PinguUserSchema.deleteOne({ _id: user.id }, null, err => {
            if (err) PinguLibrary.pUserLog(client, scriptName, errMsg, new Error(err));
            else PinguLibrary.pUserLog(client, scriptName, succMsg);
        });
    }

    constructor(user: User) {
        let pUser = new PUser(user);
        this.id = pUser.id;
        this.tag = pUser.name;
        this.sharedServers = PinguLibrary.getSharedServers(user.client, user).map(guild => new PGuild(guild));
        this.marry = new Marry();
        this.replyPerson = null;
        this.daily = new Daily();
        this.avatar = user.avatarURL();
        this.playlists = new Array<PQueue>();
    }
    public id: string
    public tag: string
    public sharedServers: PGuild[]
    public marry: Marry
    public replyPerson: PUser
    public daily: Daily
    public avatar: string
    public playlists: PQueue[]
    //public Achievements: Achievement[]
}
export class PinguGuild extends PItem {
    public static async WritePGuild(client: Client, guild: Guild, scriptName: string, succMsg: string, errMsg: string) {
        PinguLibrary.DBExecute(client, async mongoose => {
            let doc = Object.assign({ _id: guild.id }, new PinguGuild(guild));
            let created = await new PinguGuildSchema(doc).save();
            if (!created) PinguLibrary.pGuildLog(client, scriptName, errMsg);
            else PinguLibrary.pGuildLog(client, scriptName, succMsg);
        });
    }
    public static async GetPGuild(guild: Guild): Promise<PinguGuild> {
        return await PinguGuildSchema.findOne({ _id: guild.id });
    }
    public static async UpdatePGuild(client: Client, updatedProperty: object, pGuild: PinguGuild, scriptName: string, succMsg: string, errMsg: string) {
        let guild = await client.guilds.fetch(pGuild.id);
        if (!guild) throw new Error({ message: `Guild not found!` });

        PinguGuildSchema.updateOne({ _id: pGuild.id }, updatedProperty, null, err => {
            if (err) PinguLibrary.pGuildLog(client, scriptName, errMsg, err);
            else PinguLibrary.pGuildLog(client, scriptName, succMsg);
        });
    }
    public static async DeletePGuild(client: Client, guild: Guild, scriptName: string, succMsg: string, errMsg: string): Promise<PinguGuild> {
        return await PinguGuildSchema.deleteOne({ _id: guild.id }, null, err => {
            if (err) PinguLibrary.pGuildLog(client, scriptName, errMsg, new Error(err));
            else PinguLibrary.pGuildLog(client, scriptName, succMsg);
        });
    }

    public static GetPClient(client: Client, pGuild: PinguGuild) {
        return pGuild.clients.find(c => c && c.id == client.user.id);
    }

    constructor(guild: Guild) {
        super(guild);

        if (guild.owner) this.guildOwner = new PGuildMember(guild.owner);
        else guild.client.users.fetch(guild.ownerID).then(owner => this.guildOwner = new PGuildMember(guild.member(owner)));

        this.clients = new Array<PClient>();
        let clientIndex = guild.client.user.id == PinguLibrary.Clients.PinguID ? 0 : 1;
        if (clientIndex != 0) this.clients.push(null);
        this.clients[clientIndex] = new PClient(guild.client, guild);

        let welcomeChannel = guild.channels.cache.find(c => c.isText() && c.name.includes('welcome')) ||
            guild.channels.cache.find(c => c.isText() && c.name == 'general');

        if (welcomeChannel) this.welcomeChannel = new PChannel(welcomeChannel);

        this.reactionRoles = new Array<ReactionRole>();
        this.giveawayConfig = new GiveawayConfig();
        this.pollConfig = new PollConfig;
        this.suggestions = new Array<Suggestion>();
        if (guild.id == '405763731079823380')
            this.themeWinners = new Array<PGuildMember>();
    }
    public guildOwner: PGuildMember
    public clients: PClient[]
    public welcomeChannel: PChannel
    public musicQueue: PQueue
    public reactionRoles: ReactionRole[];
    public giveawayConfig: GiveawayConfig
    public pollConfig: PollConfig
    public suggestions: Suggestion[]
    public themeWinners: PGuildMember[]
}
export class PinguLibrary {
    //#region Client
    public static setActivity(client: Client) {
        class Activity {
            constructor(text: string, type: ActivityType) {
                this.text = text;
                this.type = type;
            }
            public text: string
            public type: ActivityType
        }

        internalSetActivity();
        let { updateStats } = require('./config.json');
        if (updateStats) UpdateStats();

        setInterval(internalSetActivity, 86400000);
        try { setInterval(UpdateStats, 86400000) }
        catch (err) { PinguLibrary.errorLog(client, `Updating Stats failed`, null, err); }
        function internalSetActivity() {
            let date = {
                day: new Date(Date.now()).getDate(),
                month: new Date(Date.now()).getMonth() + 1,
                year: new Date(Date.now()).getFullYear()
            };

            var activity = new Activity('your screams for', 'LISTENING');
            if (client.user.id == PinguLibrary.Clients.BetaID) activity = new Activity('Danho cry over bad code', 'WATCHING');

            if (date.month == 12)
                activity = date.day < 26 ?
                    new Activity('Jingle Bells...', 'LISTENING') :
                    new Activity('fireworks go boom', 'WATCHING');
            else if (date.month == 5)
                activity =
                    date.day == 3 ? new Activity(`Danho's birthday wishes`, 'LISTENING') :
                    date.day == 4 ? new Activity('Star Wars', 'WATCHING') : null;

            if (!activity) activity = new Activity('your screams for', 'LISTENING');

            client.user.setActivity(activity.text + ` ${PinguLibrary.DefaultPrefix(client)}help`, { type: activity.type })
            PinguLibrary.raspberryLog(client);
        }
        function UpdateStats() {
            let getChannel = (client: Client, channelID: string) => PinguLibrary.SavedServers.PinguSupport(client).channels.cache.get(channelID) as VoiceChannel;
            let channels = [
                getChannel(client, '799596588859129887'), //Servers
                getChannel(client, '799597092107583528'), //Users
                getChannel(client, '799597689792757771'), //Daily Leader
                getChannel(client, '799598372217683978'), //Server of the Day
                getChannel(client, '799598024971518002'), //User of the Day
                getChannel(client, '799598765187137537')  //Most known member
            ]
            let setName = (channel: VoiceChannel) => {
                let getInfo = (channel: VoiceChannel) => {
                    switch (channel.id) {
                        case '799596588859129887': return getServersInfo(); //Servers
                        case '799597092107583528': return getUsersInfo(); //Users
                        case '799597689792757771': return getDailyLeader(); //Daily Leader
                        case '799598372217683978': return getRandomServer(); //Server of the Day
                        case '799598024971518002': return getRandomUser(); //User of the Day
                        case '799598765187137537': return getMostKnownUser(); //Most known User
                        default: PinguLibrary.errorLog(client, `ID of ${channel.name} was not recognized!`); return "No Info";
                    }

                    function getServersInfo() {
                        return client.guilds.cache.size.toString();
                    }
                    function getUsersInfo() {
                        return client.users.cache.size.toString();
                    }
                    function getDailyLeader() {
                        try {
                            //let pUser = PinguUser.GetPUsers().sort((a, b) => {
                            //    try { return b.daily.streak - a.daily.streak }
                            //    catch (err) { PinguLibrary.errorLog(client, `Unable to get daily streak difference between ${a.tag} and ${b.tag}`, null, err); }

                            //})[0];
                            //return `${pUser.tag} #${pUser.daily.streak}`;
                            return "Under Construction"
                        }
                        catch (err) { PinguLibrary.errorLog(client, `Unable to get Daily Leader`, null, err); }
                    }
                    function getRandomServer() {
                        let availableGuilds = client.guilds.cache.array().map(g => ![
                            PinguLibrary.SavedServers.DanhoMisc(client).id,
                            PinguLibrary.SavedServers.PinguEmotes(client).id,
                            PinguLibrary.SavedServers.PinguSupport(client).id,
                        ].includes(g.id) && g.name != undefined && g).filter(v => v);
                        let index = Math.floor(Math.random() * availableGuilds.length);
                        return availableGuilds[index].name;
                    }
                    function getRandomUser() {
                        let availableUsers = client.users.cache.array().map(u => !u.bot && u).filter(v => v);
                        return availableUsers[Math.floor(Math.random() * availableUsers.length)].tag;
                    }
                    function getMostKnownUser() {
                        let Users = new Collection<User, number>();

                        client.guilds.cache.forEach(guild => {
                            guild.members.cache.forEach(gm => {
                                let { user } = gm;
                                if (user.bot) return;

                                if (!Users.has(user))
                                    return Users.set(user, 1);

                                let userServers = Users.get(user) + 1;
                                Users.delete(user);
                                Users.set(user, userServers);
                            })
                        });

                        let sorted = Users.sort((a, b) => b - a);
                        let strings = sorted.filter((v, u) => sorted.first() == v).map((v, u) => `${u.tag} | #${v}`);
                        return strings[Math.floor(Math.random() * strings.length)];
                    }
                };
                let channelName = channel.name.split(':')[0];
                let info = getInfo(channel);
                let newName = `${channelName}: ${info}`;
                if (channel.name == newName) return;
                return channel.setName(newName);
            }

            for (var channel of channels) setName(channel);
        }
    }
    public static DefaultEmbedColor = 3447003;
    public static DefaultPrefix(client: Client): '*' | 'b*' {
        return client.user.id == PinguLibrary.Clients.PinguID ?
            require('./config.json').Prefix :
            require('./config.json').BetaPrefix;
    }
    public static Clients = {
        PinguID: '562176550674366464',
        BetaID: '778288722055659520'
    }
    //#endregion

    //#region Permissions
    public static PermissionCheck(check: { author: User, channel: GuildChannel, client: Client, content: string }, permissions: string[]) {
        let { testingMode } = require('./config.json');

        if (permissions[0].length == 1) {
            this.errorLog(check.client, `Permissions not defined correctly!`, check.content);
            return "Permissions for this script was not defined correctly!";
        }

        for (var x = 0; x < permissions.length; x++) {
            var permString = permissions[x].toLowerCase().replace('_', ' ');

            if (!checkPermisson(check.channel, check.client.user, permissions[x]))
                return `I don't have permission to **${permString}** in ${check.channel.name}.`;
            else if (!checkPermisson(check.channel, check.author, permissions[x]) &&
                (this.isPinguDev(check.author) && testingMode || !this.isPinguDev(check.author)))
                return `<@${check.author.id}> you don't have permission to **${permString}** in #${check.channel.name}.`;
        }
        return this.PermissionGranted;

        function checkPermisson(channel: GuildChannel, user: User, permission: string) {
            return channel.permissionsFor(user).has(permission as PermissionString);
        }
    }
    public static readonly PermissionGranted = "Permission Granted";

    public static get Permissions(): {
        given: BitPermission[],
        missing: BitPermission[],
        all: BitPermission[]
    } {
        //let all = Array.from(getPermissions()).reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {});
        let givenStrings = [
            DiscordPermissions.MANAGE_ROLES,
            DiscordPermissions.MANAGE_CHANNELS,
            DiscordPermissions.CHANGE_NICKNAME,
            DiscordPermissions.VIEW_CHANNEL,
            DiscordPermissions.SEND_MESSAGES,
            DiscordPermissions.SEND_TTS_MESSAGES,
            DiscordPermissions.MANAGE_MESSAGES,
            DiscordPermissions.EMBED_LINKS,
            DiscordPermissions.ATTACH_FILES,
            DiscordPermissions.MANAGE_EMOJIS,
            DiscordPermissions.READ_MESSAGE_HISTORY,
            DiscordPermissions.USE_EXTERNAL_EMOJIS,
            DiscordPermissions.ADD_REACTIONS,
            DiscordPermissions.CONNECT,
            DiscordPermissions.SPEAK,
            DiscordPermissions.USE_VAD,
            DiscordPermissions.VIEW_AUDIT_LOG
        ];

        let given = [], missing = [], all = [];
        for (var perm of Array.from(getPermissions())) {
            let permObj = new BitPermission(perm[0], perm[1]);

            if (givenStrings.includes(perm[0]))
                given.push(permObj);
            else missing.push(permObj);
            all.push(permObj);
        }

        return { given, missing, all };

        function getPermissions() {
            let temp = new Map<PermissionString, number>();
            let bits = getBitValues();
            for (var prop in DiscordPermissions) {
                if (prop == 'bitOf') continue;
                temp.set(prop as PermissionString, bits.find(bits => bits.permString == prop).bit);
            }
            return temp;
        }
        function getBitValues() {
            let permissions = Object.keys(DiscordPermissions)
                .map(permString => new BitPermission(permString, 0))
                .filter(perm => perm.permString != 'bitOf');

            for (var i = 0; i < permissions.length; i++)
                permissions[i].bit = i == 0 ? 1 : permissions[i - 1].bit * 2;

            return permissions;
        }
    }
    //#endregion

    //#region Servers
    public static readonly SavedServers = {
        DanhoMisc(client: Client) {
            return PinguLibrary.getServer(client, '460926327269359626');
        },
        PinguSupport(client: Client) {
            return PinguLibrary.getServer(client, '756383096646926376');
        },
        PinguEmotes(client: Client) {
            return PinguLibrary.getServer(client, '791312245555855401');
        },
        DeadlyNinja(client: Client) {
            return PinguLibrary.getServer(client, '405763731079823380');
        }
    }
    private static getServer(client: Client, id: string) {
        return client.guilds.cache.find(g => g.id == id);
    }
    public static getSharedServers(client: Client, user: User): Guild[] {
        let servers = [];
        client.guilds.cache.forEach(g => g.members.cache.forEach(gm => {
            if (gm.user.id == user.id)
                servers.push(g);
        }));
        return servers;
    }
    //#endregion

    //#region Pingu Developers
    private static readonly PinguDevelopers: string[] = [
        '245572699894710272', //Danho#2105
        '405331883157880846', //Synthy Sytro
        '803903863706484756' //Slothman
    ];
    public static isPinguDev(user: User) {
        //console.log(`[${this.PinguDevelopers.join(', ')}].includes(${user.id})`);
        return this.PinguDevelopers.includes(user.id);
    }
    //#endregion

    //#region Channels
    public static getChannel(client: Client, guildID: string, channelname: string) {
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
    public static async outages(client: Client, message: string) {
        var outageChannel = this.getChannel(client, '756383096646926376', 'outages');
        if (!outageChannel) return this.DanhoDM(client, `Couldn't get #outage channel in Pingu Support, https://discord.gg/Mp4CH8eftv`);
        this.consoleLog(client, message);
        let sent = await outageChannel.send(message);
        return sent.crosspost();
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
    //#endregion

    //#region Log Channels
    public static async errorLog(client: Client, message: string, messageContent?: string, err?: Error) {
        var errorlogChannel = this.getChannel(client, this.SavedServers.PinguSupport(client).id, 'error-log');
        if (!errorlogChannel) return this.DanhoDM(client, 'Unable to find #error-log in Pingu Support');

        console.error(getErrorMessage(message.includes('`') ? message.replace('`', ' ') : message, messageContent, err));
        let sent = await errorlogChannel.send(getErrorMessage(message, messageContent, err));
        await sent.react(PinguLibrary.SavedServers.DanhoMisc(client).emojis.cache.find(e => e.name == 'Checkmark'));
        return sent;

        function getErrorMessage(message: string, messageContent?: string, err?: Error) {
            let result = {
                format: "```\n",
                providedMessage: `[Provided Message]\n${message}\n\n`,
                errorMessage: `[Error message]: \n${err && err.message}\n\n`,
                messageContent: `[Message content]\n${messageContent}\n\n`,
                stack: `[Stack]\n${err && err.stack}\n\n\n`,
                fileMessage: `${err && err.fileName} threw an error at line ${err && err.lineNumber}!\n\n`
            };

            let returnMessage = (
                result.format +
                (err && err.fileName && err.lineNumber ? result.fileMessage : "") +
                result.providedMessage +
                (messageContent ? result.messageContent : "") +
                (err ? result.errorMessage + result.stack : "") +
                result.format
            );

            PinguLibrary.consoleLog(client, returnMessage);
            return returnMessage
        }
    }
    public static async pGuildLog(client: Client, script: string, message: string, err?: Error) {
        var pinguGuildLog = this.getChannel(client, this.SavedServers.PinguSupport(client).id, "pingu-guild-log");

        if (err) {
            var errorLink = (await this.errorLog(client, `pGuild Error: "${message}"`, null, err)).url;
            return pinguGuildLog.send(`[**Failed**] [**${script}**]: ${message}\n${err.message}\n\n${errorLink}\n\n<@&756383446871310399>`);
        }
        return pinguGuildLog.send(`[**Success**] [**${script}**]: ${message}`);
    }
    public static async pUserLog(client: Client, script: string, message: string, err?: Error) {
        var pinguUserLog = this.getChannel(client, this.SavedServers.PinguSupport(client).id, "pingu-user-log");

        if (err) {
            var errorLink = (await this.errorLog(client, `pUser Error (**${script}**): "${message}"`, null, err)).url;
            return pinguUserLog.send(`[**Failed**] [**${script}**]: ${message}\n${err.message}\n\n${errorLink}\n\n<@&756383446871310399>`);
        }
        return pinguUserLog.send(`[**Success**] [**${script}**]: ${message}`);
    }
    public static async consoleLog(client: Client, message: string) {
        let timeFormat = `[${new Date(Date.now()).toLocaleTimeString()}]`;
        console.log(`${timeFormat} ${message}`);

        let consoleLogChannel = this.getChannel(client, this.SavedServers.PinguSupport(client).id, "console-log");
        if (!consoleLogChannel) return this.DanhoDM(client, 'Unable to find #console-log in Pingu Support');

        consoleLogChannel.send(message);
    }
    public static async eventLog(client: Client, content: MessageEmbed) {
        if (client.user.id == PinguLibrary.Clients.BetaID) return;

        let eventLogChannel = this.getChannel(client, this.SavedServers.PinguSupport(client).id, "event-log");
        if (!eventLogChannel) return this.DanhoDM(client, `Couldn't get #event-log channel in Pingu Support, https://discord.gg/gbxRV4Ekvh`)

        if (!PinguEvents.LoggedCache) PinguEvents.LoggedCache = new Array<MessageEmbed>();
        let lastCache = PinguEvents.LoggedCache[0];
        if (lastCache && (
            lastCache.description && lastCache.description == content.description ||
            lastCache.fields[0] && content.fields[0] && lastCache.fields[0].value == content.fields[0].value)
        ) return;

        PinguEvents.LoggedCache.unshift(content);
        return await eventLogChannel.send(content);
    }
    public static async tellLog(client: Client, sender: User, reciever: User, message: Message | MessageEmbed) {
        if (client.user.id == PinguLibrary.Clients.BetaID) return;

        var tellLogChannel = this.getChannel(client, this.SavedServers.PinguSupport(client).id, 'tell-log');
        if (!tellLogChannel) return this.DanhoDM(client, `Couldn't get #tell-log channel in Pingu Support, https://discord.gg/gbxRV4Ekvh`)

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

            PinguLibrary.consoleLog(client, consoleLog);

            var format = (ping: boolean) => `${new Date(Date.now()).toLocaleTimeString()} [<@${(ping ? sender : sender.username)}> ➡️ <@${(ping ? reciever : reciever.username)}>]`;

            if (messageAsMessage.content && messageAsMessage.attachments)
                tellLogChannel.send(format(false) + `: ||${messageAsMessage.content}||`, messageAsMessage.attachments.array())
                    .then(sent => sent.edit(format(true) + `: ||${messageAsMessage.content}||`));

            else if (messageAsMessage.content)
                tellLogChannel.send(format(false) + `: ||${messageAsMessage.content}||`)
                    .then(sent => sent.edit(format(true) + `: ||${messageAsMessage.content}||`));

            else if (messageAsMessage.attachments)
                tellLogChannel.send(format(false), messageAsMessage.attachments.array())
                    .then(sent => sent.edit(format(true)));

            else this.errorLog(client, `${sender} ➡️ ${reciever} sent something that didn't have content or attachments`)
                .then(() => tellLogChannel.send(`Ran else statement - reported to ${tellLogChannel.guild.channels.cache.find(c => c.name == 'error-log')}`));
        }
        else if ((message as MessageEmbed).constructor.name == "MessageEmbed") {
            this.consoleLog(client, `The link between ${sender.username} & ${reciever.username} was unset.`);
            tellLogChannel.send(message as MessageEmbed)
        }
    }
    public static async LatencyCheck(message: Message) {
        //Get latency
        let pingChannel = this.getChannel(message.client, this.SavedServers.PinguSupport(message.client).id, "ping-log");
        if (message.channel == pingChannel || message.author.bot) return;

        let pingChannelSent = await pingChannel.send(`Calculating ping`);

        let latency = pingChannelSent.createdTimestamp - message.createdTimestamp;
        pingChannelSent.edit(latency);

        //Get outages channel
        let outages = this.getChannel(message.client, this.SavedServers.PinguSupport(message.client).id, "outages");
        if (!outages) return this.errorLog(message.client, `Unable to find outages channel from LatencyCheck!`);

        //Set up to find last Pingu message
        let outagesMessages = outages.messages.cache.array();
        let outageMessagesCount = outagesMessages.length - 1;

        //Find Pingu message
        for (var i = outageMessagesCount - 1; i >= 0; i--) {
            if (outagesMessages[i].author != message.client.user) continue;
            var lastPinguMessage = outagesMessages[i];
        }

        if (!lastPinguMessage) return;

        let sendMessage = !lastPinguMessage.content.includes(`I have a latency delay on`);
        if (!sendMessage) {
            let lastMessageArgs = lastPinguMessage.content.split(` `);
            let lastLatencyExclaim = lastMessageArgs[lastMessageArgs.length - 1];
            let lastLatency = parseInt(lastLatencyExclaim.substring(0, lastLatencyExclaim.length - 1));

            if (lastLatency > 1000)
                return lastPinguMessage.edit(`I have a latency delay on ${latency}!`);
        }

        if (latency > 1000) PinguLibrary.outages(message.client, `I have a latency delay on ${latency}!`);
    }
    public static async raspberryLog(client: Client) {
        if (client.user.id == PinguLibrary.Clients.BetaID) return;

        let raspberryLogChannel = this.getChannel(client, this.SavedServers.PinguSupport(client).id, 'raspberry-log');
        if (!raspberryLogChannel) return this.DanhoDM(client, `Couldn't get #raspberry-log channel in Pingu Support, https://discord.gg/gbxRV4Ekvh`)

        return raspberryLogChannel.send(`Pulled version ${require('./config.json').version} from Github`);
    }
    //#endregion

    public static getEmote(client: Client, name: string, emoteGuild: Guild) {
        if (!client || !name || !emoteGuild) return '😵';

        let emote = client.guilds.cache.find(g => g.id == emoteGuild.id).emojis.cache.find(e => e.name == name);
        if (emote) return emote;
        PinguLibrary.errorLog(client, `Unable to find Emote **${name}** from ${emoteGuild.name}`);
        return '😵';
    }
    public static getImage(script: string, imageName: string) {
        return `./embedImages/${script}_${imageName}.png`;
    }
    public static async DBExecute(client: Client, callback: (mongoose: typeof import('mongoose')) => void) {
        try {
            const { mongoPass } = require('./config.json')
            await mongoose.connect(`mongodb+srv://Pingu:${mongoPass}@pingudb.kh2uq.mongodb.net/PinguDB?retryWrites=true&w=majority`, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            });
            await callback(mongoose);
        } catch (err) { PinguLibrary.errorLog(client, 'Mongo error', null, new Error(err)); }
        //finally { mongoose.connection.close(); }
    }
}
export class PinguEvents {
    public static Colors = {
        Create: `#18f151`,
        Update: `#ddfa00`,
        Delete: `#db1108`
    };
    public static noAuditLog = `**No Audit Log Permissions**`;
    public static LoggedCache: MessageEmbed[];

    public static async GetAuditLogs(guild: Guild, type: GuildAuditLogsAction, key?: string, target: User = null, seconds: number = 1) {
        if (!guild.me.hasPermission(DiscordPermissions.VIEW_AUDIT_LOG as BitFieldResolvable<PermissionString>))
            return this.noAuditLog;

        let now = new Date(Date.now());
        let logs = (await guild.fetchAuditLogs({ type }));
        now.setSeconds(now.getSeconds() - seconds);
        let filteredLogs = logs.entries.filter(e => e.createdTimestamp > now.getTime());

        try { return key ? filteredLogs.find(e => e.changes.find(change => change.key == key) && (target ? e.target == target : true)).executor.tag : filteredLogs.first().executor.tag; }
        catch (err) { if (err.message == `Cannot read property 'executor' of undefined`) return this.noAuditLog; }
    }
    public static UnknownUpdate(old: object, current: object) {
        let oldArr = Object.keys(old);
        let currentArr = Object.keys(current);

        for (var i = 0; i < currentArr.length || i < oldArr.length; i++) {
            if (currentArr[i] != oldArr[i])
                return PinguEvents.SetDescriptionValues('Unknown', oldArr[i], currentArr[i]);
        }

        return null;
    }

    public static SetDescription(type: string, description: string) {
        return `[**${type}**]\n\n${description}`;
    }
    public static SetRemove(type: string, oldValue: object, newValue: object, SetString: string, RemoveString: string, descriptionMethod: (type: string, oldValue: object, newValue: object) => string) {
        return newValue && !oldValue ? PinguEvents.SetDescription(type, SetString) :
            !newValue && oldValue ? PinguEvents.SetDescription(type, RemoveString) : descriptionMethod(type, oldValue, newValue);
    }
    public static SetDescriptionValues(type: string, oldValue: any, newValue: any) {
        return PinguEvents.SetDescription(type, `Old: ${oldValue}\n\nNew: ${newValue}`)
    }
    public static SetDescriptionValuesLink(type: string, oldValue: any, newValue: any) {
        return PinguEvents.SetDescription(type, `[Old](${oldValue})\n[New](${newValue})`)
    }
    public static GoThroughArrays<T>(type: string, preArr: T[], newArr: T[], callback: (item: T, loopItem: T) => T) {
        let updateMessage = `[**${type}**] `;
        let removed = [], added = [];

        for (var newItem of newArr) {
            let old = preArr.find(i => callback(i, newItem));

            if (!old) added.push(newItem);
        }

        for (var oldItem of preArr) {
            let add = newArr.find(i => callback(i, newItem));

            if (!add) removed.push(oldItem);
        }

        if (added.length == 0 && removed.length != 0) return updateMessage += removed.join(`, `).substring(removed.join(', ').length - 2);
        else if (removed.length == 0 && added.length != 0) return updateMessage += added.join(`, `).substring(added.join(', ').length - 2);
        return updateMessage += `Unable to find out what changed!`;
    }
}
//#endregion

abstract class Decidable {
    constructor(value: string, id: string, author: PGuildMember, channel: GuildChannel) {
        this.value = value;
        this.id = id;
        this.author = author;
        this.channel = new PChannel(channel);
    }
    public value: string
    public id: string
    public author: PGuildMember
    public channel: PChannel
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
    constructor(value: string, id: string, author: PGuildMember, channel: GuildChannel) {
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
    channel: PChannel;
}

//#region PollConfig
interface IPollConfigOptions extends IDecidableConfigOptions {
    pollRole: PRole;
    polls: Poll[];
}
export class PollConfig implements IPollConfigOptions {
    constructor(options?: IPollConfigOptions) {
        this.pollRole = options ? options.pollRole : undefined;
        this.channel = options ? options.channel : undefined;
        if (options) this.polls = options.polls;
    }
    pollRole: PRole;
    polls: Poll[];
    channel: PChannel;
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
        this.allowSameWinner = options ? options.allowSameWinner : undefined;
        this.hostRole = options ? options.hostRole : undefined;
        this.winnerRole = options ? options.winnerRole : undefined;
        this.channel = options ? options.channel : undefined;
        if (options) this.giveaways = options.giveaways;
    }
    allowSameWinner: boolean;
    hostRole: PRole;
    winnerRole: PRole;
    giveaways: Giveaway[];
    channel: PChannel;
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

        this.endsAt = EndsAt;
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
    public endsAt: Date

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
interface IMuisc {
    loop: boolean,
    volume: number,
    playing: boolean
}
export class Queue implements IMuisc {
    constructor(client: PClient, logChannel: TextChannel, voiceChannel: VoiceChannel, songs: Song[], playing = true) {
        this.logChannel = logChannel;
        this.voiceChannel = voiceChannel;
        this.songs = songs;
        this.volume = 1;
        this.connection = null;
        this.playing = playing;
        this.client = client;
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
    public client: PClient

    get currentSong(): Song {
        return this.songs[this.index];
    }

    /** Adds song to the start of the queue
     * @param song song to add*/
    public addFirst(song: Song) {
        song.id = this.songs.length;
        this.songs.unshift(song);
    }
    /** Adds song to queue
     * @param song song to add*/
    public add(...songs: Song[]) {
        songs.forEach(song => {
            song.id = this.songs.length;
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
}
export class Song implements IMuisc {
    constructor(author: User, songInfo: MoreVideoDetails) {
        //YouTube
        this.link = songInfo.video_url;
        this.title = songInfo.title;
        this.author = songInfo.author && songInfo.author.name;
        this.length = this.GetLength(songInfo.lengthSeconds);
        this.lengthMS = parseInt(songInfo.lengthSeconds) * 1000;
        this.thumbnail = songInfo.thumbnails[0].url;

        this.requestedBy = new PUser(author);
        this.id = 0;
        this.volume = -1;
        this.loop = false;
        this.endsAt = null;
    }
    public id: number
    public title: string
    public link: string
    public author: string
    public thumbnail: string
    public length: string
    public lengthMS: number
    public volume: number
    public playing: boolean
    public loop: boolean
    public endsAt: Date
    public requestedBy: PUser

    public play() {
        this.endsAt = new Date(Date.now() + this.lengthMS);
    }
    public stop() {
        this.endsAt = null;
    }
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

export class Daily {
    constructor() {
        this.lastClaim = null;
        this.nextClaim = null;
        this.streak = 0;
    }

    public lastClaim: Date
    public nextClaim: TimeLeftObject
    public streak: number
}
export class ReactionRole {
    constructor(message: Message, reactionName: string, role: Role) {
        this.emoteName = reactionName;
        this.pRole = new PRole(role);
        this.channel = new PChannel(message.channel as GuildChannel);
        this.messageID = message.id;
    }

    public channel: PChannel
    public messageID: string
    public emoteName: string
    public pRole: PRole

    public static async GetReactionRole(client: Client, reaction: MessageReaction, user: User) {
        let guild = reaction.message.guild;
        let pGuild = await PinguGuild.GetPGuild(guild);
        var rr = pGuild.reactionRoles.find(rr =>
            rr.messageID == reaction.message.id &&
            (rr.emoteName == reaction.emoji.name) &&
            rr.channel.id == reaction.message.channel.id
        ); 
        if (!rr) return null;

        let { pRole } = rr;
        let member = guild.member(user);

        let permCheck = PinguLibrary.PermissionCheck({
            author: client.user,
            client,
            channel: reaction.message.channel as GuildChannel,
            content: "No content provided"
        }, [DiscordPermissions.MANAGE_ROLES]);
        if (permCheck != PinguLibrary.PermissionGranted) {
            guild.owner.send(`I tried to give ${member.displayName} the ${pRole.name}, as ${permCheck}`);
            user.send(`I'm unable to give you the reactionrole at the moment! I've contacted ${user.username} about this.`);
            return null;
        }

        return guild.roles.fetch(pRole.id);
    }
}
export class Marry {
    constructor(partner?: PUser, internalDate?: string) {
        this.partner = partner;
        this.internalDate = internalDate ? new Date(internalDate) : null;
    }

    public partner: PUser
    public internalDate: Date
    public get marriedMessage(): string {
        return `You have been ${(this.partner ? `married to <@${this.partner.id}> since` : `single since`)} **${this.internalDate.toLocaleTimeString()}, ${this.internalDate.toLocaleDateString().split('.').join('/')}**`;
    }

    public marry(partner: User) {
        this.internalDate = new Date(Date.now());
        this.partner = new PUser(partner);
    }
    public divorce() {
        this.internalDate = new Date(Date.now());
        this.partner = null;
    }
}