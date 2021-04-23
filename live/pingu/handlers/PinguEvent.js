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
const PinguClient_1 = require("../client/PinguClient");
const PinguHandler_1 = require("./PinguHandler");
const PinguLibrary_1 = require("../library/PinguLibrary");
const PinguLibrary = { errorLog: PinguLibrary_1.errorLog, eventLog: PinguLibrary_1.eventLog, errorCache: PinguLibrary_1.errorCache, SavedServers: PinguLibrary_1.SavedServers };
const PinguGuild_1 = require("../guild/PinguGuild");
const helpers_1 = require("../../helpers");
const PinguUser_1 = require("../user/PinguUser");
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
        if (!guild.me.hasPermission('VIEW_AUDIT_LOG'))
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
    if (added.length == 0 && removed.length != 0)
        return updateMessage += removed.join(`, `).substring(removed.join(', ').length - 2);
    else if (removed.length == 0 && added.length != 0)
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
            return PinguLibrary.errorLog(client, `Unable to get event for ${caller}`, null, new helpers_1.Error(err));
        }
        if (!event || !event.execute && !event.setContent)
            return; //Event not found or doesn't have any callbacks assigned
        function execute() {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    return event.execute(PinguClient_1.ToPinguClient(client), ...args);
                }
                catch (err) {
                    PinguLibrary.errorLog(client, `${event.name}.execute`, null, new helpers_1.Error(err), {
                        params: { caller, path, args: Object.assign({}, args) },
                        additional: { event, args }
                    });
                }
            });
        }
        function setContent() {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    return SendToLog();
                }
                catch (err) {
                    PinguLibrary.errorLog(client, `${event.name}.setContent`, null, new helpers_1.Error(err), {
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
            if (!PinguLibrary.errorCache) {
                const { errorCache } = require('../library/PinguLibrary');
                PinguLibrary.errorCache = errorCache;
            }
            PinguLibrary.errorLog(client, err.message, JSON.stringify(args, null, 2), err, {
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
        PinguLibrary_1.AchievementCheck(client, { user, guild, guildMember }, 'EVENT', caller, args);
        function SendToLog() {
            return __awaiter(this, void 0, void 0, function* () {
                const emitAssociatorOptions = (parameter = {}) => {
                    const options = [
                        parameter.author && parameter.author.tag,
                        parameter.tag,
                        parameter.user && parameter.user.tag,
                        parameter.member && parameter.member.user.tag,
                        parameter.users && parameter.users.cache.last() && parameter.users.cache.last().tag,
                        parameter.last && parameter.last() && parameter.last().author.tag,
                        parameter.inviter && parameter.inviter.tag,
                        parameter.name,
                        parameter.guild && parameter.guild.name
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
                let isPinguUser = emitAssociator.match(/#\d{4}$/g) && (yield PinguUser_1.PinguUser.Get(client.users.cache.find(u => u.tag == emitAssociator))) != null;
                // if (!isPinguUser) return null;
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
                if (caller == 'message' && ['event-log-📹', 'ping-log-🏓', 'console-log-📝'].includes(args[0].channel.name))
                    return;
                let embed = yield CreateEmbed();
                if (!PinguLibrary.eventLog) {
                    const { eventLog } = require('../library/PinguLibrary');
                    PinguLibrary.eventLog = eventLog;
                }
                if (embed)
                    return PinguLibrary.eventLog(client, embed);
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
                                PinguLibrary.errorLog(client, `"${event.name}" was not recognized as an event name when searching from audit log`);
                                return "Unknown";
                        }
                        function GetInfo(guild, auditLogEvent) {
                            return __awaiter(this, void 0, void 0, function* () {
                                let auditLogs = yield getAuditLogs(guild, auditLogEvent);
                                if (auditLogs == noAuditLog)
                                    return noAuditLog;
                                auditLogs = auditLogs;
                                return auditLogs.last() && auditLogs.last().executor.tag || PinguEvent.noAuditLog;
                            });
                        }
                        function getAuditLogs(guild, type) {
                            return __awaiter(this, void 0, void 0, function* () {
                                const me = guild.me || guild.member(guild.client.user);
                                if (!me.hasPermission('VIEW_AUDIT_LOG'))
                                    return noAuditLog;
                                return (yield guild.fetchAuditLogs({ type })).entries.filter(e => new Date(Date.now()).getSeconds() - e.createdAt.getSeconds() <= 1);
                            });
                        }
                    });
                }
                function CreateEmbed() {
                    return __awaiter(this, void 0, void 0, function* () {
                        let [user, guild, executed] = [
                            client.users.cache.find(u => u.tag == emitAssociator),
                            client.guilds.cache.find(g => g.name == emitAssociator),
                            new Date(Date.now())
                        ];
                        const getDoubleDigit = (num) => num < 10 ? `0${num}` : `${num}`;
                        let defaultEmbed = new discord_js_1.MessageEmbed()
                            .setTitle(event.name)
                            .setAuthor(emitAssociator, (!emitAssociator || emitAssociator == "Unknown" ? null :
                            emitAssociator.match(/#\d{4}$/g) ?
                                user && user.avatarURL() :
                                guild && guild.iconURL()))
                            .setColor(yield getColor())
                            .setFooter(`${getDoubleDigit(executed.getHours())}.${getDoubleDigit(executed.getMinutes())}.${getDoubleDigit(executed.getSeconds())}:${executed.getMilliseconds()}`);
                        if (event.setContent) {
                            yield event.setContent(...args);
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
                                    return (yield PinguGuild_1.PinguGuild.Get(PinguLibrary.SavedServers.get('Pingu Support'))).clients.find(c => c._id == client.user.id).embedColor;
                                }
                                catch (_a) {
                                    return PinguClient_1.ToPinguClient(client).DefaultEmbedColor;
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
class PinguEvent extends PinguHandler_1.PinguHandler {
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
    setContent(...args) {
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
