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
exports.BasePinguClient = exports.ToBasePinguClient = exports.Clients = void 0;
const discord_js_1 = require("discord.js");
const fs = require("fs");
exports.Clients = {
    PinguID: '562176550674366464',
    BetaID: '778288722055659520'
};
function ToBasePinguClient(client) { return client; }
exports.ToBasePinguClient = ToBasePinguClient;
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
}
class BasePinguClient extends discord_js_1.Client {
    constructor(config, permissions, subscribedEvents, dirname, commandsPath, eventsPath, options) {
        super(options);
        this.DefaultEmbedColor = 3447003;
        this.invite = `https://discord.gg/gbxRV4Ekvh`;
        this.commands = new discord_js_1.Collection();
        this.events = new discord_js_1.Collection();
        this.subscribedEvents = new Array();
        this.clients = new discord_js_1.Collection();
        this.cache = new PinguCacheManager_1.default();
        this.config = config;
        this.subscribedEvents = subscribedEvents;
        this.permissions = new PermissionsManager_1.default(this, permissions);
        this.emotes = new EmojiCollection_1.default(this);
        this.pGuilds = new PinguCollection_1.default(this, 'pingu-guild-log', 'PinguGuild', g => new PinguGuild_1.default(g, g.members.cache.get(g.ownerId)), c => c.guilds);
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
    //#endregion
    //#region Publoic Overwritten methods
    setActivity(options) {
        if (options)
            return this.user.setActivity(options);
        class Activity {
            constructor(text, type) {
                this.text = text;
                this.type = type;
            }
        }
        let date = {
            day: new Date(Date.now()).getDate(),
            month: new Date(Date.now()).getMonth() + 1,
            year: new Date(Date.now()).getFullYear()
        };
        var activity = this.isLive ? new Activity('your screams for', 'LISTENING') : new Activity('Danho cry over bad code', 'WATCHING');
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
    log(type, ...args) {
        return __awaiter(this, void 0, void 0, function* () {
            const logChannel = this.logChannels.get(type);
            return new discord_js_1.Collection([
                ['achievement', this.achievementLog],
                ['console', this.consoleLog],
                ['error', this.errorLog],
                ['event', this.eventLog],
                ['pGuild', this.pGuildLog],
                ['pUser', this.pUserLog],
                ['ping', this.pingLog],
                ['raspberry', this.raspberryLog],
                ['tell', this.tellLog]
            ]).get(type)(logChannel, ...args);
        });
    }
    DBExecute(callback) {
        return __awaiter(this, void 0, void 0, function* () { return database_1.DBExecute(this, callback); });
    }
    DanhoDM(message) {
        return __awaiter(this, void 0, void 0, function* () {
            console.error(message);
            const Danho = this.developers.get('Danho');
            if (!Danho)
                return;
            return (yield Danho.createDM()).send(message);
        });
    }
    //#endregion
    //#region Protected methods
    onceReady() {
        return __awaiter(this, void 0, void 0, function* () {
            this.DefaultPrefix = this.isLive || !this.config.BetaPrefix ? this.config.Prefix : this.config.BetaPrefix;
            this.savedServers = (() => {
                return new discord_js_1.Collection([
                    new SavedServer('Danho Misc', '460926327269359626'),
                    new SavedServer('Pingu Support', '756383096646926376'),
                    new SavedServer('Pingu Emotes', '791312245555855401'),
                    new SavedServer('Deadly Ninja', '405763731079823380')
                ].map(({ name, id }) => [name, this.guilds.cache.get(id)]));
            })();
            this.logChannels = (() => {
                return new discord_js_1.Collection(new discord_js_1.Collection([
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
            })();
            this.clients = new discord_js_1.Collection([
                ['Live', this.isLive ? this.user : yield this.users.fetch(exports.Clients.PinguID)],
                ['Beta', !this.isLive ? this.user : yield this.users.fetch(exports.Clients.BetaID)]
            ]);
            const devUsers = yield Promise.all(DeveloperCollection_1.developers.map(id => this.savedServers.get('Pingu Support').members.cache.get(id)));
            this.developers = devUsers.reduce((result, member) => result.set(DeveloperCollection_1.developers.findKey(id => id == member.id), member), new DeveloperCollection_1.default());
            this.badges = new discord_js_1.Collection(PinguBadge_1.TempBadges.map((temp, name) => {
                const guild = this.savedServers.get(temp.guild);
                const emoji = guild.emojis.cache.find(e => e.name == temp.emojiName);
                return [name, new PinguBadge_1.PinguBadge(name, emoji, temp.weight)];
            }));
            this.emotes.refresh(this);
            yield this.pGuilds.refresh(this);
            yield this.pUsers.refresh(this);
            this.pGuildMembers = new discord_js_1.Collection((yield Promise.all(this.guilds.cache.map((guild) => __awaiter(this, void 0, void 0, function* () {
                return ({
                    guild, collection: yield new PinguGuildMemberCollection_1.default(this, 'pingu-guild-log', guild).refresh()
                });
            })))).map(({ guild, collection }) => [guild, collection]));
            this.emit('onready', this);
        });
    }
    //#endregion
    //#region Log Methods
    achievementLog(channel, achievementEmbed) {
        return __awaiter(this, void 0, void 0, function* () {
            return channel.send({ embeds: [achievementEmbed] });
        });
    }
    consoleLog(channel, message, type = 'log') {
        return __awaiter(this, void 0, void 0, function* () {
            console[type](`[${new Date().toLocaleTimeString()}] ${message}`);
            return channel.send(message);
        });
    }
    errorLog(channel, message, messageContent, err, params) {
        return __awaiter(this, void 0, void 0, function* () {
            const that = channel.client;
            //Get #error-log
            let errorPath = './errors';
            if (!fs.existsSync(errorPath)) {
                fs.mkdirSync(errorPath);
                fs.writeFileSync(`${errorPath}/dont delete me pls.txt`, ``);
            }
            const errorID = fs.readdirSync(errorPath).filter(file => file.endsWith('.json')).length;
            const consoleLogChannel = that.logChannels.get('console');
            const fsCallback = (fileExtension) => that.consoleLog(consoleLogChannel, `Created ${fileExtension} file for error #${errorID}.`);
            const jsonErrorContent = JSON.stringify({ err, params }, null, 2);
            fs.writeFile(`${errorPath}/${errorID}.json`, jsonErrorContent, () => fsCallback('json'));
            //Send and react
            const sentCatcher = (e, fileExtension) => __awaiter(this, void 0, void 0, function* () {
                console.error(`Caught error with:\n${e.message}\n\n`);
                if (new RegExp(/Must be (2|4)000 or fewer in length\./).test(e.message)) {
                    const filePath = `${errorPath}/${errorID}.${fileExtension}`;
                    if (fileExtension == 'txt') {
                        const fileContent = getErrorMessage(message, messageContent, err);
                        fs.writeFile(filePath, fileContent, () => fsCallback(fileExtension));
                    }
                    return channel.send({ files: [new discord_js_1.MessageAttachment(filePath, `Error ${errorID}.${fileExtension}`)] });
                }
            });
            let sent = yield sendMessage(getErrorMessage(message, messageContent, err)).catch(err => sentCatcher(err, 'txt'));
            let paramsSent = yield sendMessage("```\n[Parameters]:\n" + jsonErrorContent + "\n```").catch(err => sentCatcher(err, 'json'));
            //Add to errorCache
            that.cache.errors.set(errorID, [sent, paramsSent]);
            //Send original errror message
            return sent;
            function getErrorMessage(message, messageContent, err) {
                let result = {
                    errorID: `Error #${errorID}\n`,
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
                that.consoleLog(consoleLogChannel, returnMessage);
                return returnMessage;
            }
            function sendMessage(content) {
                return __awaiter(this, void 0, void 0, function* () {
                    console.error(content.includes('`') ? content.replace('`', ' ') : content);
                    let sent = yield channel.send(content);
                    yield sent.react(that.emotes.get('Checkmark')[0]);
                    yield sent.react('📄'); //Get error file
                    //Create reaction handler
                    sent.createReactionCollector().on('collect', (reaction, user) => __awaiter(this, void 0, void 0, function* () {
                        if (that.developers.isPinguDev(reaction.message.guild.members.cache.get(user.id)) || !reaction.users.cache.has(that.id))
                            return reaction.remove();
                        if (reaction.emoji.name == '📄') {
                            let fileMessage = yield reaction.message.channel.send({ files: [new discord_js_1.MessageAttachment(`${errorPath}/${errorID}.json`, `Error ${errorID}.json`)] });
                            return that.cache.errors.set(errorID, [...that.cache.errors.get(errorID), fileMessage]);
                        }
                        that.cache.errors.get(errorID).forEach(m => m.delete());
                        const errorFiles = fs.readdirSync(errorPath).filter(file => file.startsWith(errorID.toString()));
                        errorFiles.forEach(file => fs.unlink(`${errorPath}/${file}`, () => that.log('console', `Deleted error #${errorID}.`)));
                    }));
                    return sent;
                });
            }
        });
    }
    eventLog(channel, content) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.isLive)
                return null;
            const lastCache = this.cache.events[0];
            if (lastCache && (lastCache.description && lastCache.description == content.description ||
                lastCache.fields[0] && content.fields[0] && lastCache.fields[0].value == content.fields[0].value))
                return;
            this.cache.events.unshift(content);
            return channel.send({ embeds: [content] });
        });
    }
    pingLog(channel, timestamp) {
        return __awaiter(this, void 0, void 0, function* () {
            const pingChannelSent = yield channel.send(`Calculating ping`);
            const latency = pingChannelSent.createdTimestamp - timestamp;
            return pingChannelSent.edit(latency + 'ms');
        });
    }
    pGuildLog(channel, script, message, err) {
        return __awaiter(this, void 0, void 0, function* () {
            if (err) {
                var errorLink = (yield this.log('error', `PinguGuild Error: "${message}"`, null, err)).url;
                return channel.send(`[**Failed**] [**${script}**]: ${message}\n${err.message}\n\n${errorLink}\n\n<@&756383446871310399>`);
            }
            return channel.send(`[**Success**] [**${script}**]: ${message}`);
        });
    }
    pUserLog(channel, script, message, err) {
        return __awaiter(this, void 0, void 0, function* () {
            if (err) {
                var errorLink = (yield this.log('error', `PinguUser Error (**${script}**): "${message}"`, null, err)).url;
                return channel.send(`[**Failed**] [**${script}**]: ${message}\n${err.message}\n\n${errorLink}\n\n<@&756383446871310399>`);
            }
            return channel.send(`[**Success**] [**${script}**]: ${message}`);
        });
    }
    raspberryLog(channel) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = ToBasePinguClient(channel.client);
            if (!client.isLive)
                return null;
            return channel.send(`Booted on version **${client.config.version}**.`);
        });
    }
    tellLog(channel, sender, reciever, message) {
        return __awaiter(this, void 0, void 0, function* () {
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
                    channel.send({ content: format(false) + `: ||${messageAsMessage.content}||`, files: [...messageAsMessage.attachments.values()] })
                        .then(sent => sent.edit(format(true) + `: ||${messageAsMessage.content}||`));
                else if (messageAsMessage.content)
                    channel.send(format(false) + `: ||${messageAsMessage.content}||`)
                        .then(sent => sent.edit(format(true) + `: ||${messageAsMessage.content}||`));
                else if (messageAsMessage.attachments)
                    channel.send({ content: format(false), files: [...messageAsMessage.attachments.values()] })
                        .then(sent => sent.edit(format(true)));
                else
                    this.log('error', `${sender} ➡️ ${reciever} sent something that didn't have content or attachments`, message.constructor.name == 'Message' ? message.content : message.description, null, {
                        params: { sender, reciever, message },
                        additional: { tellLogChannel: channel, consoleLogValue }
                    }).then(() => channel.send(`Ran else statement - I've contacted my developers!`));
            }
            else if (message.constructor.name == "MessageEmbed") {
                this.log('console', `The link between ${sender.username} & ${reciever.username} was unset.`);
                channel.send({ embeds: [message] });
            }
        });
    }
}
exports.BasePinguClient = BasePinguClient;
BasePinguClient.Clients = exports.Clients;
exports.default = BasePinguClient;
