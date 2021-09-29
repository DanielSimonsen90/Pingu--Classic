"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PinguClientBase = exports.Clients = void 0;
const discord_js_1 = require("discord.js");
const fs = require("fs");
exports.Clients = {
    PinguID: '562176550674366464',
    BetaID: '778288722055659520'
};
const TimeSpan_1 = require("../../helpers/TimeSpan");
const PinguCollection_1 = require("../collection/PinguCollection");
const DeveloperCollection_1 = require("../collection/DeveloperCollection");
const EmojiCollection_1 = require("../collection/EmojiCollection");
const PinguGuildMemberCollection_1 = require("../collection/PinguGuildMemberCollection");
const database_1 = require("../../database");
const PermissionsManager_1 = require("../PermissionsManager");
const PinguCacheManager_1 = require("../PinguCacheManager");
const PinguBadge_1 = require("../badge/PinguBadge");
const PinguUser_1 = require("../user/PinguUser");
const PinguGuild_1 = require("../guild/PinguGuild");
class SavedServer {
    constructor(name, id) {
        this.name = name;
        this.id = id;
    }
    name;
    id;
}
const SlashCommandCollection_1 = require("../collection/SlashCommandCollection");
class PinguClientBase extends discord_js_1.Client {
    static Clients = exports.Clients;
    constructor(config, permissions, subscribedEvents, dirname, commandsPath, eventsPath, options) {
        super(options);
        this.log = this.log.bind(this);
        // this.DBExecute = this.DBExecute.bind(this);
        // this.DanhoDM = this.DanhoDM.bind(this);
        // this.timeFormat = this.timeFormat.bind(this);
        // this.onceReady = this.onceReady.bind(this);
        // this.handlePath =  this.handlePath.bind(this);
        // this.achievementLog = this.achievementLog.bind(this);
        this.consoleLog = this.consoleLog.bind(this);
        this.errorLog = this.errorLog.bind(this);
        // this.eventLog = this.eventLog.bind(this);
        // this.pingLog = this.pingLog.bind(this);
        // this.pGuildLog = this.pGuildLog.bind(this);
        // this.pUserLog = this.pUserLog.bind(this);
        // this.raspberryLog = this.raspberryLog.bind(this);
        // this.tellLog = this.tellLog.bind(this);
        this.config = config;
        this.subscribedEvents = subscribedEvents;
        this.permissions = new PermissionsManager_1.default(this, permissions);
        this.emotes = new EmojiCollection_1.default(this);
        this.pGuilds = new PinguCollection_1.default(this, 'pingu-guild-log', 'PinguGuild', g => new PinguGuild_1.default(g, g.owner()), c => c.guilds);
        this.pUsers = new PinguCollection_1.default(this, 'pingu-user-log', 'PinguUser', u => new PinguUser_1.default(u), c => c.users);
        this.once('ready', this.onceReady);
        if (!dirname.toLowerCase().startsWith('c:'))
            throw new Error('Incorrect dirname; use __dirname!');
        [commandsPath, eventsPath]
            .map(path => path && `${dirname}\\${path.replace(/^.\//, '')}`)
            .forEach((path, i) => this.handlePath(path, i == 0 ? 'command' : 'event'));
    }
    //#region Public properties
    get id() {
        return this.user.id;
    }
    get isLive() {
        return this.id == exports.Clients.PinguID;
    }
    get member() {
        return this.savedServers.get('Pingu Support').me;
    }
    DefaultEmbedColor = 3447003;
    invite = `https://discord.gg/gbxRV4Ekvh`;
    commands = new discord_js_1.Collection();
    slashCommands = new SlashCommandCollection_1.default(this);
    events = new discord_js_1.Collection();
    subscribedEvents = new Array();
    DefaultPrefix;
    clients = new discord_js_1.Collection();
    permissions;
    cache = new PinguCacheManager_1.default();
    config;
    logChannels;
    developers;
    savedServers;
    badges;
    pGuilds;
    pGuildMembers;
    pUsers;
    emotes;
    //#endregion
    //#region Private properties
    _logTypeHandlers;
    //#endregion
    //#region Public Overwritten methods
    setActivity(options) {
        if (options)
            return this.user.setActivity(options);
        class Activity {
            constructor(text, type) {
                this.text = text;
                this.type = type;
            }
            text;
            type;
        }
        let date = {
            day: new Date(Date.now()).getDate(),
            month: new Date(Date.now()).getMonth() + 1,
            year: new Date(Date.now()).getFullYear()
        };
        var activity = this.isLive ? new Activity('your screams for', 'LISTENING') : new Activity(`Danho cry over bad code whilst running on version ${this.config.version}`, 'WATCHING');
        if (date.month == 12)
            activity = date.day < 26 ?
                new Activity('Jingle Bells...', 'LISTENING') :
                new Activity('fireworks go boom', 'WATCHING');
        else if (date.month == 5)
            activity =
                date.day == 3 ? new Activity(`Danho's birthday wishes`, 'LISTENING') :
                    date.day == 4 ? new Activity('Star Wars', 'WATCHING') : null;
        let Danho = this.developers.get('Danho');
        let DanhoStream = Danho.presence.activities.find(a => a.type == 'STREAMING');
        if (DanhoStream)
            return this.user.setActivity({
                name: DanhoStream.details,
                type: DanhoStream.type,
                url: DanhoStream.url
            });
        if (!activity)
            activity = new Activity('your screams for', 'LISTENING');
        return this.user.setActivity({
            name: activity.text + ` ${this.DefaultPrefix}help`,
            type: activity.type
        });
    }
    //#endregion
    //#region Public methods
    toPClient(pGuild) {
        return pGuild.clients.find(c => c && c._id == this.user.id);
    }
    async log(type, ...args) {
        const logChannel = this.logChannels.get(type);
        return this._logTypeHandlers.get(type)(logChannel, ...args);
    }
    async DBExecute(callback) { return database_1.DBExecute(this, callback); }
    async DanhoDM(message) {
        console.error(message);
        const Danho = this.developers.get('Danho');
        if (!Danho)
            return;
        return (await Danho.createDM()).send(message);
    }
    /**
     * @SHORT_TIME hh:mm
     * @LONG_TIME hh:mm:ss
     * @SHORT_DATE dd/MM/yyyy
     * @LONG_DATE dd Monthname yyyy
     * @SHORT_DATETIME dd Monthname yyyy hh:mm
     * @LONG_DATETIME Day, dd Monthname yyyy hh:mm
     * @RELATIVE x timeunit ago
     */
    timeFormat(timestamp, ...formats) {
        return TimeSpan_1.TimeFormat(timestamp, ...formats);
    }
    //#endregion
    //#region Protected methods
    async onceReady() {
        this.DefaultPrefix = this.isLive || !this.config.betaPrefix ? this.config.prefix : this.config.betaPrefix;
        this.savedServers = new discord_js_1.Collection([
            new SavedServer('Danho Misc', '460926327269359626'),
            new SavedServer('Pingu Support', '756383096646926376'),
            new SavedServer('Pingu Emotes', '791312245555855401'),
            new SavedServer('Deadly Ninja', '405763731079823380')
        ].map(({ name, id }) => [name, this.guilds.cache.get(id)]));
        this.logChannels = new discord_js_1.Collection(new discord_js_1.Collection([
            ['achievement', 'achievement-log-🏆'],
            ['console', 'console-log-📝'],
            ['error', 'error-log-⚠'],
            ['event', 'event-log-📹'],
            ['pGuild', 'pingu-guild-log-🏡'],
            ['pUser', 'pingu-user-log-🧍'],
            ['ping', 'ping-log-🏓'],
            ['raspberry', 'raspberry-log-🍇'],
            ['tell', 'tell-log-💬']
        ]).map((channelName, key) => {
            const logChannels = this.savedServers.get('Pingu Support').channels.cache.find(c => c.name.includes('Pingu Logs'));
            const logChannel = logChannels.children.find(c => c.name == channelName);
            return [key, logChannel];
        }));
        this._logTypeHandlers = new discord_js_1.Collection([
            ['achievement', this.achievementLog],
            ['console', this.consoleLog],
            ['error', this.errorLog],
            ['event', this.eventLog],
            ['pGuild', this.pGuildLog],
            ['pUser', this.pUserLog],
            ['ping', this.pingLog],
            ['raspberry', this.raspberryLog],
            ['tell', this.tellLog]
        ]
            .map(([type, logMethod]) => [type, logMethod.bind(this)]));
        this.clients = new discord_js_1.Collection([
            ['Live', this.isLive ? this.user : await this.users.fetch(exports.Clients.PinguID)],
            ['Beta', !this.isLive ? this.user : await this.users.fetch(exports.Clients.BetaID)]
        ]);
        const devUsers = await Promise.all(DeveloperCollection_1.developers.map(id => this.savedServers.get('Pingu Support').members.cache.get(id)));
        this.developers = devUsers.reduce((result, member) => result.set(DeveloperCollection_1.developers.findKey(id => id == member.id), member), new DeveloperCollection_1.default());
        this.badges = new discord_js_1.Collection(PinguBadge_1.TempBadges.map((temp, name) => {
            const guild = this.savedServers.get(temp.guild);
            const emoji = guild.emojis.cache.find(e => e.name == temp.emojiName);
            return [name, new PinguBadge_1.PinguBadge(name, emoji, temp.weight)];
        }));
        this.emotes.refresh(this);
        await this.pGuilds.refresh(this);
        this.pGuildMembers = new discord_js_1.Collection((await Promise.all(this.guilds.cache.map(async (guild) => ({
            guild, collection: await new PinguGuildMemberCollection_1.default(this, 'pingu-guild-log', guild).refresh(this, true)
        })))).map(({ guild, collection }) => [guild, collection]));
        this.log('console', `Successfull refreshed all entries for **PinguGuildMember**.`);
        await this.pUsers.refresh(this);
        this.emit('onready', this);
    }
    //#endregion
    //#region Private Log Methods
    async achievementLog(channel, achievementEmbed) {
        return channel.sendEmbeds(achievementEmbed);
    }
    async consoleLog(channel, message, type = 'log') {
        console[type](`[${new Date().toLocaleTimeString()}] ${message}`);
        return channel.send(message);
    }
    async errorLog(channel, message, messageContent, err, params) {
        const that = this;
        //Get #error-log
        let errorPath = './errors';
        if (!fs.existsSync(errorPath)) {
            fs.mkdirSync(errorPath);
            fs.writeFileSync(`${errorPath}/dont delete me pls.txt`, ``);
        }
        const errorId = fs.readdirSync(errorPath).filter(file => file.endsWith('.json')).length;
        const consoleLogChannel = this.logChannels.get('console');
        const fsCallback = (fileExtension) => this.consoleLog(consoleLogChannel, `Created ${fileExtension} file for error #${errorId}.`);
        const jsonErrorContent = JSON.stringify({ err, params }, null, 2);
        fs.writeFile(`${errorPath}/${errorId}.json`, jsonErrorContent, () => fsCallback('json'));
        //Send and react
        const sentCatcher = async (e, fileExtension) => {
            console.error(`Caught error with:\n${e.message}\n\n`);
            if (new RegExp(/Must be (2|4)000 or fewer in length\./).test(e.message)) {
                const filePath = `${errorPath}/${errorId}.${fileExtension}`;
                if (fileExtension == 'txt') {
                    const fileContent = getErrorMessage(message, messageContent, err);
                    fs.writeFile(filePath, fileContent, () => fsCallback(fileExtension));
                }
                return channel.sendFiles(new discord_js_1.MessageAttachment(filePath, `Error ${errorId}.${fileExtension}`));
            }
        };
        const getErrorMessage = (function (message, messageContent, err) {
            let result = {
                errorID: `Error #${errorId}\n`,
                format: "```\n",
                providedMessage: `[Provided Message]\n${message}\n\n`,
                errorMessage: `[Error message]: \n${err && err.message}\n\n`,
                messageContent: `[Message content]\n${messageContent}\n\n`,
                stack: `[Stack]\n${err && err.stack}\n\n\n`,
            };
            let returnMessage = (result.errorID +
                result.format +
                result.providedMessage +
                (messageContent ? result.messageContent : "") +
                (err ? result.errorMessage + result.stack : "") +
                result.format);
            this.consoleLog(consoleLogChannel, returnMessage);
            return returnMessage;
        }).bind(this);
        const sent = await sendMessage(getErrorMessage(message, messageContent, err)).catch(err => sentCatcher(err, 'txt'));
        const paramsSent = await sendMessage("```\n[Parameters]:\n" + jsonErrorContent + "\n```").catch(err => sentCatcher(err, 'json'));
        //Add to errorCache
        this.cache.errors.set(errorId, [sent, paramsSent]);
        //Send original errror message
        return sent;
        async function sendMessage(content) {
            console.error(content.replace(/`/, ''));
            const sent = await channel.send(content);
            await sent.react(that.emotes.get('Checkmark')[0]);
            await sent.react('📄'); //Get error file
            //Create reaction handler
            sent.createReactionCollector().on('collect', async (reaction, user) => {
                if (user.isPinguDev() || !reaction.users.cache.has(that.id))
                    return reaction.remove();
                if (reaction.emoji.name == '📄') {
                    let fileMessage = await reaction.message.channel.sendFiles(new discord_js_1.MessageAttachment(`${errorPath}/${errorId}.json`, `Error ${errorId}.json`));
                    return that.cache.errors.set(errorId, [...that.cache.errors.get(errorId), fileMessage]);
                }
                that.cache.errors.get(errorId).forEach(m => m.delete());
                const errorFiles = fs.readdirSync(errorPath).filter(file => file.startsWith(errorId.toString()));
                errorFiles.forEach(file => fs.unlink(`${errorPath}/${file}`, () => that.log('console', `Deleted error #${errorId}.`)));
            });
            return sent;
        }
    }
    async eventLog(channel, content) {
        if (!this.isLive)
            return null;
        const lastCache = this.cache.events[0];
        if (lastCache && (lastCache.description && lastCache.description == content.description ||
            lastCache.fields[0] && content.fields[0] && lastCache.fields[0].value == content.fields[0].value))
            return;
        this.cache.events.unshift(content);
        return channel.sendEmbeds(content);
    }
    async pingLog(channel, timestamp) {
        const pingChannelSent = await channel.send(`Calculating ping`);
        const latency = pingChannelSent.createdTimestamp - timestamp;
        return pingChannelSent.edit(latency + 'ms');
    }
    async pGuildLog(channel, script, message, err) {
        if (err) {
            var errorLink = (await this.log('error', `PinguGuild Error: "${message}"`, null, err)).url;
            return channel.send(`[**Failed**] [**${script}**]: ${message}\n${err.message}\n\n${errorLink}\n\n<@&756383446871310399>`);
        }
        return channel.send(`[**Success**] [**${script}**]: ${message}`);
    }
    async pUserLog(channel, script, message, err) {
        if (err) {
            var errorLink = (await this.log('error', `PinguUser Error (**${script}**): "${message}"`, null, err)).url;
            return channel.send(`[**Failed**] [**${script}**]: ${message}\n${err.message}\n\n${errorLink}\n\n<@&756383446871310399>`);
        }
        return channel.send(`[**Success**] [**${script}**]: ${message}`);
    }
    async raspberryLog(channel) {
        const { client } = channel;
        if (!client.isLive)
            return null;
        return channel.send(`Booted on version **${client.config.version}**.`);
    }
    async tellLog(channel, sender, reciever, message) {
        if (!this.isLive)
            return null;
        if (message.constructor.name == "Message") {
            var messageAsMessage = message;
            var consoleLogValue = messageAsMessage.content ? `${sender.username} sent a message to ${reciever.username} saying ` :
                messageAsMessage.attachments.size == 1 ? `${sender.username} sent a file to ${reciever.username}` :
                    messageAsMessage.attachments.size > 1 ? `${sender.username} sent ${messageAsMessage.attachments.size} files to ${reciever.username}` :
                        `${sender.username} sent something unknown to ${reciever.username}!`;
            if (messageAsMessage.content)
                consoleLogValue += messageAsMessage.content;
            if (messageAsMessage.attachments)
                consoleLogValue += messageAsMessage.attachments.map(a => `\n${a.url}`);
            this.log('console', consoleLogValue);
            var format = (ping) => `${new Date().toLocaleTimeString()} [${(ping ? sender : sender.username)} ➡️ ${(ping ? reciever : reciever.username)}]`;
            if (messageAsMessage.content && messageAsMessage.attachments)
                channel.send({ content: format(false) + `: ||${messageAsMessage.content}||`, files: messageAsMessage.attachments.valueArr() })
                    .then(sent => sent.edit(format(true) + `: ||${messageAsMessage.content}||`));
            else if (messageAsMessage.content)
                channel.send(format(false) + `: ||${messageAsMessage.content}||`)
                    .then(sent => sent.edit(format(true) + `: ||${messageAsMessage.content}||`));
            else if (messageAsMessage.attachments)
                channel.send({ content: format(false), files: messageAsMessage.attachments.valueArr() })
                    .then(sent => sent.edit(format(true)));
            else
                this.log('error', `${sender} ➡️ ${reciever} sent something that didn't have content or attachments`, message.constructor.name == 'Message' ? message.content : message.description, null, {
                    params: { sender, reciever, message },
                    additional: { tellLogChannel: channel, consoleLogValue }
                }).then(() => channel.send(`Ran else statement - I've contacted my developers!`));
        }
        else if (message.constructor.name == "MessageEmbed") {
            this.log('console', `The link between ${sender.username} & ${reciever.username} was unset.`);
            channel.sendEmbeds(message);
        }
    }
}
exports.PinguClientBase = PinguClientBase;
exports.default = PinguClientBase;
