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
exports.PinguEvent = exports.HandleEvent = exports.GoThroughObjectArray = exports.GoThroughArrays = exports.SetDescriptionValuesLink = exports.SetDescriptionValues = exports.SetRemove = exports.SetDescription = exports.UnknownUpdate = exports.GetAuditLogs = exports.noAuditLog = exports.LoggedCache = exports.Colors = void 0;
const discord_js_1 = require("discord.js");
const achievements_1 = require("../achievements");
const Error_1 = require("../../helpers/Error");
// export interface PinguEventParams {
//     client?: Client,
//     messages?: Collection<string, Message>,
//     reaction?: MessageReaction,
//     invite?: Invite,
//     channel?: GuildChannel | DMChannel,
//     preChannel?: GuildChannel | DMChannel,
//     guild?: Guild,
//     preGuild?: Guild,
//     message?: Message,
//     preMessage?: Message,
//     member?: GuildMember,
//     preMember?: GuildMember,
//     user?: User,
//     preUser?: User,
//     emote?: GuildEmoji,
//     preEmote?: GuildEmoji,
//     presence?: Presence,
//     prePresence?: Presence,
//     role?: Role,
//     preRole?: Role,
//     state?: VoiceState
//     preState?: VoiceState
// }
//#region Statics
exports.Colors = {
    Create: `#18f151`,
    Update: `#ddfa00`,
    Delete: `#db1108`
};
exports.LoggedCache = new Array();
exports.noAuditLog = `**No Audit Log Permissions**`;
function GetAuditLogs(guild, type, key, target = null, seconds = 1) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!guild.me || !guild.me.hasPermission('VIEW_AUDIT_LOG'))
            return exports.noAuditLog;
        let now = new Date(Date.now());
        let logs = (yield guild.fetchAuditLogs({ type }));
        now.setSeconds(now.getSeconds() - seconds);
        let filteredLogs = logs.entries.filter(e => e.createdTimestamp > now.getTime());
        try {
            return key ? filteredLogs.find(e => e.changes.find(change => change.key == key) && (target ? e.target == target : true)).executor.tag : filteredLogs.first().executor.tag;
        }
        catch (err) {
            if (err.message == `Cannot read property 'executor' of undefined`)
                return exports.noAuditLog;
        }
    });
}
exports.GetAuditLogs = GetAuditLogs;
function UnknownUpdate(old, current) {
    let oldArr = Object.keys(old);
    let currentArr = Object.keys(current);
    for (var i = 0; i < currentArr.length || i < oldArr.length; i++) {
        if (currentArr[i] != oldArr[i])
            return SetDescriptionValues('Unknown', oldArr[i], currentArr[i]);
    }
    return null;
}
exports.UnknownUpdate = UnknownUpdate;
function SetDescription(type, description) {
    return `[**${type}**]\n\n${description}`;
}
exports.SetDescription = SetDescription;
function SetRemove(type, oldValue, newValue, SetString, RemoveString, descriptionMethod) {
    return newValue && !oldValue ? SetDescription(type, SetString) :
        !newValue && oldValue ? SetDescription(type, RemoveString) : descriptionMethod(type, oldValue, newValue);
}
exports.SetRemove = SetRemove;
function SetDescriptionValues(type, oldValue, newValue) {
    return SetDescription(type, `Old: ${oldValue}\n\nNew: ${newValue}`);
}
exports.SetDescriptionValues = SetDescriptionValues;
function SetDescriptionValuesLink(type, oldValue, newValue) {
    return SetDescription(type, `[Old](${oldValue})\n[New](${newValue})`);
}
exports.SetDescriptionValuesLink = SetDescriptionValuesLink;
/**@param type [**${type}**]
 * @param preArr Previous array
 * @param newArr Current array
 * @param callback pre/new.find(i => callback(i, preItem/newItem))*/
function GoThroughArrays(type, preArr, newArr, callback) {
    let updateMessage = `[**${type}**] `;
    let added = GoThroguhArray(newArr, preArr);
    let removed = GoThroguhArray(preArr, newArr);
    if (!added.length && removed.length)
        return updateMessage += removed.join(`, `).substring(removed.join(', ').length - 2);
    else if (!removed.length && added.length)
        return updateMessage += added.join(`, `).substring(added.join(', ').length - 2);
    return updateMessage += `Unable to find out what changed!`;
    function GoThroguhArray(cycleArr, otherCycleArr) {
        let result = new Array();
        for (var item of cycleArr) {
            let old = otherCycleArr.find(i => callback(i, item));
            if (!old)
                result.push(item);
        }
        return result;
    }
}
exports.GoThroughArrays = GoThroughArrays;
function GoThroughObjectArray(type, preArr, newArr) {
    let updateMessage = `[**${type}**]\n`;
    let changes = new discord_js_1.Collection();
    if (preArr.length > newArr.length)
        return updateMessage += `Removed ${type.toLowerCase()}`;
    else if (newArr.length > preArr.length)
        return updateMessage += `Added new ${type.toLowerCase()}`;
    for (var i = 0; i < newArr.length; i++) {
        let newKeys = Object.keys(newArr[i]);
        let preKeys = Object.keys(preArr[i]);
        newKeys.forEach(key => {
            if (newArr[key] == preArr[key])
                return;
            else if (!preArr[key])
                changes.set(key, `__Added__: ${newArr[key]}`);
            else
                changes.set(key, `__Changed__: **${preArr[key]}** => **${newArr[key]}**`);
        });
        preKeys.forEach(key => {
            if (changes.get(key) || preKeys[key] == newKeys[key])
                return;
            else if (!newArr[key])
                changes.set(key, `__Removed__: ${preArr[key]}`);
        });
    }
    changes.keyArray().forEach(key => updateMessage += `**${key}**: ${changes.get(key)}\n`);
    return updateMessage;
}
exports.GoThroughObjectArray = GoThroughObjectArray;
function HandleEvent(caller, client, path, ...args) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            var event = require(`../../../../..${path}`);
        }
        catch (err) {
            console.log({ err, caller, path });
            return client.log('error', `Unable to get event for ${caller}`, null, new Error_1.default(err));
        }
        if (!event || !event.execute && !event.setContent)
            return; //Event not found or doesn't have any callbacks assigned
        function execute() {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    return event.execute(client, ...args);
                }
                catch (err) {
                    client.log('error', `${event.name}.execute`, null, new Error_1.default(err), {
                        params: { caller, path, args: Object.assign({}, args) },
                        additional: { event, args }
                    });
                }
            });
        }
        function setContent() {
            return __awaiter(this, void 0, void 0, function* () {
                if (!client.isLive)
                    return;
                try {
                    return SendToLog();
                }
                catch (err) {
                    client.log('error', `${event.name}.setContent`, null, new Error_1.default(err), {
                        params: { caller, path, args: Object.assign({}, args) },
                        additional: { event, args }
                    });
                }
            });
        }
        try {
            if (event.execute && event.setContent)
                yield Promise.all([execute(), setContent()]);
            else if (event.execute)
                yield execute();
            else if (event.setContent)
                yield setContent();
        }
        catch (err) {
            client.log('error', err.message, JSON.stringify(args, null, 2), err, {
                params: { caller, path, args: Object.assign({}, args) },
                additional: { event }
            });
        }
        const achievementOptions = (parameters = {}, type) => {
            switch (type) {
                case 'User': return [
                    parameters.author, parameters.user, parameters.inviter, FindClass("User"),
                    parameters.users && parameters.users.first && parameters.users.first(),
                    parameters.last && parameters.last()
                ].filter(v => v)[0];
                case 'GuildMember': return [parameters.member, FindClass("GuildMember")].filter(v => v)[0];
                case 'Guild': return [parameters.guild, FindClass("Guild")].filter(v => v)[0];
            }
        };
        function getAchiever(type) {
            let result = null;
            for (const arg of args) {
                if (result)
                    return result;
                else
                    result = achievementOptions(arg, type);
            }
        }
        var [user, guild, guildMember] = [
            getAchiever('User'),
            getAchiever('Guild'),
            getAchiever('GuildMember')
        ];
        user = !user && guildMember ? guildMember.user : null;
        achievements_1.AchievementCheck(client, { user, guild, guildMember }, 'EVENT', caller, args);
        function SendToLog() {
            return __awaiter(this, void 0, void 0, function* () {
                const emitAssociatorOptions = (parameter = {}) => {
                    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
                    const options = [
                        (_a = parameter.author) === null || _a === void 0 ? void 0 : _a.tag,
                        parameter.tag,
                        (_b = parameter.user) === null || _b === void 0 ? void 0 : _b.tag,
                        (_d = (_c = parameter.member) === null || _c === void 0 ? void 0 : _c.user) === null || _d === void 0 ? void 0 : _d.tag,
                        (_h = (_g = (_e = parameter.users) === null || _e === void 0 ? void 0 : (_f = _e.cache).last) === null || _g === void 0 ? void 0 : _g.call(_f)) === null || _h === void 0 ? void 0 : _h.tag,
                        (_k = (_j = parameter.last) === null || _j === void 0 ? void 0 : _j.call(parameter)) === null || _k === void 0 ? void 0 : _k.author.tag,
                        (_l = parameter.inviter) === null || _l === void 0 ? void 0 : _l.tag,
                        parameter.name,
                        (_m = parameter.guild) === null || _m === void 0 ? void 0 : _m.name
                    ];
                    return options.filter(v => v)[0];
                };
                let emitAssociator = "";
                for (const arg of args) {
                    if (emitAssociator)
                        break;
                    else
                        emitAssociator = emitAssociatorOptions(arg);
                }
                if (!emitAssociator)
                    emitAssociator = "Unknown";
                //Don't log if emitter isn't a PinguUser
                if (emitAssociator.match(/#\d{4}$/g)) {
                    var isPinguUser = false;
                    let user = client.users.cache.find(u => u.tag == emitAssociator);
                    if (user) {
                        isPinguUser = !user.bot && client.pUsers.get(user) != null;
                    }
                    // if (!isPinguUser) return null;
                }
                let specialEvents = [
                    'channelCreate', 'channelUpdate', 'channelDelete', 'channelPinsUpdate',
                    'webhookUpdate',
                    'emojiCreate', 'emojiUpdate', 'emojiDelete',
                    'guildBanAdd', 'guildBanRemove', 'guildMemberUpdate',
                    'guildUpdate', 'guildIntergrationsUpdate',
                    'roleCreate', 'roleUpdate', 'roleDelete',
                    'messageBulkDelete'
                ];
                if (specialEvents.includes(event.name))
                    emitAssociator = yield GetFromAuditLog();
                if (emitAssociator == 'Unknown')
                    throw { message: `Event parameter for ${event.name} was not recognized!` };
                if (caller.startsWith('message') && !caller.startsWith('messageReaction') && ['event-log-📹', 'ping-log-🏓', 'console-log-📝'].includes(args[0].channel && args[0].channel.name))
                    return;
                let embed = yield CreateEmbed();
                if (embed)
                    return client.log('event', embed);
                function GetFromAuditLog() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const noAuditLog = PinguEvent.noAuditLog;
                        switch (event.name) {
                            case 'channelCreate': return !args[0].guild ? args[0].recipient.tag : yield GetInfo(args[0].guild, 'CHANNEL_CREATE');
                            case 'channelUpdate': return !args[0].guild ? args[0].recipient.tag : yield GetInfo(args[0].guild, 'CHANNEL_UPDATE');
                            case 'channelDelete': return !args[0].guild ? args[0].recipient.tag : yield GetInfo(args[0].guild, 'CHANNEL_DELETE');
                            case 'channelPinsUpdate': return !args[0].guild ? args[0].recipient.tag :
                                ((yield GetInfo(args[0].guild, 'MESSAGE_PIN')) || (yield GetInfo(args[0].guild, 'MESSAGE_UNPIN')));
                            case 'webhookCreate': return yield GetInfo(args[0].guild, 'WEBHOOK_CREATE');
                            case 'webhookUpdate': return yield GetInfo(args[0].guild, 'WEBHOOK_UPDATE');
                            case 'webhookDelete': return yield GetInfo(args[0].guild, 'WEBHOOK_DELETE');
                            case 'emojiCreate': return yield GetInfo(args[0].guild, 'EMOJI_CREATE');
                            case 'emojiUpdate': return yield GetInfo(args[0].guild, 'EMOJI_UPDATE');
                            case 'emojiDelete': return yield GetInfo(args[0].guild, 'EMOJI_DELETE');
                            case 'guildBanAdd': return yield GetInfo(args[0], 'MEMBER_BAN_ADD');
                            case 'guildMemberUpdate': return yield GetInfo(args[0].guild, 'MEMBER_UPDATE');
                            case 'guildBanRemove': return yield GetInfo(args[0], 'MEMBER_BAN_REMOVE');
                            case 'guildUpdate': return yield GetInfo(args[0], 'GUILD_UPDATE');
                            case 'guildIntegrationsUpdate': return yield GetInfo(args[0], 'INTEGRATION_UPDATE');
                            case 'messageBulkDelete': return yield GetInfo(args[0].last().guild, 'MESSAGE_BULK_DELETE');
                            case 'roleCreate': return yield GetInfo(args[0].guild, 'ROLE_CREATE');
                            case 'roleUpdate': return yield GetInfo(args[0].guild, 'ROLE_UPDATE');
                            case 'roleDelete': return yield GetInfo(args[0].guild, 'ROLE_DELETE');
                            default:
                                client.log('error', `"${event.name}" was not recognized as an event name when searching from audit log`);
                                return "Unknown";
                        }
                        function GetInfo(guild, auditLogEvent) {
                            var _a;
                            return __awaiter(this, void 0, void 0, function* () {
                                let auditLogs = yield getAuditLogs(guild, auditLogEvent);
                                if (auditLogs == noAuditLog)
                                    return noAuditLog;
                                auditLogs = auditLogs;
                                return ((_a = auditLogs.last()) === null || _a === void 0 ? void 0 : _a.executor.tag) || PinguEvent.noAuditLog;
                            });
                        }
                        function getAuditLogs(guild, type) {
                            return __awaiter(this, void 0, void 0, function* () {
                                const me = guild.me || guild.member(guild.client.user);
                                if (!me || !me.hasPermission('VIEW_AUDIT_LOG'))
                                    return noAuditLog;
                                return (yield guild.fetchAuditLogs({ type })).entries.filter(e => new Date().getSeconds() - e.createdAt.getSeconds() <= 1);
                            });
                        }
                    });
                }
                function CreateEmbed() {
                    return __awaiter(this, void 0, void 0, function* () {
                        let [user, guild, executed] = [
                            client.users.cache.find(u => u.tag == emitAssociator),
                            client.guilds.cache.find(g => g.name == emitAssociator),
                            new Date()
                        ];
                        const getDoubleDigit = (num) => num < 10 ? `0${num}` : `${num}`;
                        let defaultEmbed = new discord_js_1.MessageEmbed({
                            title: event.name,
                            author: {
                                name: emitAssociator,
                                iconURL: (!emitAssociator || emitAssociator == "Unknown" ? null :
                                    emitAssociator.match(/#\d{4}$/g) ?
                                        user && user.avatarURL() :
                                        guild && guild.iconURL())
                            },
                            color: yield getColor(),
                            footer: {
                                text: `${getDoubleDigit(executed.getHours())}.${getDoubleDigit(executed.getMinutes())}.${getDoubleDigit(executed.getSeconds())}:${executed.getMilliseconds()}`
                            }
                        });
                        if (event.setContent) {
                            yield event.setContent(client, ...args);
                            if (!event.content)
                                return null;
                            defaultEmbed = (function CombineEmbeds() {
                                for (var key in event.content)
                                    if (event.content[key])
                                        defaultEmbed[key] = event.content[key];
                                return defaultEmbed;
                            })();
                        }
                        return !defaultEmbed.description && (defaultEmbed.fields && defaultEmbed.fields[0] || true) ? null : defaultEmbed;
                        function getColor() {
                            return __awaiter(this, void 0, void 0, function* () {
                                if (event.name.includes('Create') || event.name.includes('Add'))
                                    return PinguEvent.Colors.Create;
                                else if (event.name.includes('Delete') || event.name.includes('Remove'))
                                    return PinguEvent.Colors.Delete;
                                else if (event.name.includes('Update'))
                                    return PinguEvent.Colors.Update;
                                try {
                                    return client.pGuilds.get(client.savedServers.get('Pingu Support')).clients.find(c => c._id == client.id).embedColor;
                                }
                                catch (_a) {
                                    return client.DefaultEmbedColor;
                                }
                            });
                        }
                    });
                }
            });
        }
        function FindClass(type) {
            const objectsOfClass = args.filter(a => a && a.constructor && a.constructor.name == type);
            return objectsOfClass ? objectsOfClass[objectsOfClass.length - 1] : null;
        }
    });
}
exports.HandleEvent = HandleEvent;
//#endregion
const PinguHandler_1 = require("./PinguHandler");
class PinguEvent extends PinguHandler_1.default {
    //#endregion
    constructor(name, setContent, execute) {
        super(name);
        if (setContent)
            this.setContent = setContent;
        this.execute = execute;
    }
    static GetAuditLogs(guild, type, key, target = null, seconds = 1) {
        return __awaiter(this, void 0, void 0, function* () { return GetAuditLogs(guild, type, key, target, seconds); });
    }
    static UnknownUpdate(old, current) { return UnknownUpdate(old, current); }
    static SetDescription(type, description) { return SetDescription(type, description); }
    static SetRemove(type, oldValue, newValue, SetString, RemoveString, descriptionMethod) {
        return SetRemove(type, oldValue, newValue, SetString, RemoveString, descriptionMethod);
    }
    static SetDescriptionValues(type, oldValue, newValue) { return SetDescriptionValues(type, oldValue, newValue); }
    static SetDescriptionValuesLink(type, oldValue, newValue) { return SetDescriptionValuesLink(type, oldValue, newValue); }
    static GoThroughArrays(type, preArr, newArr, callback) { return GoThroughArrays(type, preArr, newArr, callback); }
    static GoThroughObjectArray(type, preArr, newArr) { return GoThroughObjectArray(type, preArr, newArr); }
    static HandleEvent(caller, client, path, ...args) {
        return __awaiter(this, void 0, void 0, function* () { return HandleEvent(caller, client, path, ...args); });
    }
    setContent(client, ...args) {
        return __awaiter(this, void 0, void 0, function* () { return null; });
    }
    execute(client, ...args) {
        return __awaiter(this, void 0, void 0, function* () { return null; });
    }
}
exports.PinguEvent = PinguEvent;
//#region Statics
PinguEvent.Colors = exports.Colors;
PinguEvent.noAuditLog = exports.noAuditLog;
PinguEvent.LoggedCache = exports.LoggedCache;
exports.default = PinguEvent;
