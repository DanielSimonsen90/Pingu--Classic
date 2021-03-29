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
exports.PinguLibrary = exports.RequestImage = exports.getEmote = exports.getImage = exports.DBExecute = exports.BlankEmbedField = exports.AchievementCheck = exports.AchievementCheckType = exports.raspberryLog = exports.latencyCheck = exports.tellLog = exports.achievementLog = exports.eventLog = exports.consoleLog = exports.pUserLog = exports.pGuildLog = exports.errorLog = exports.errorCache = exports.DanhoDM = exports.outages = exports.getTextChannel = exports.isPinguDev = exports.CacheDevelopers = exports.Developers = exports.getSharedServers = exports.getServer = exports.SavedServers = exports.PinguSupportInvite = exports.Permissions = exports.PermissionCheck = exports.PermissionGranted = void 0;
const discord_js_1 = require("discord.js");
const fs = require("fs");
const request = require("request");
const helpers_1 = require("../../helpers");
exports.PermissionGranted = "Permission Granted";
function PermissionCheck(check, ...permissions) {
    if (permissions[0].length == 1) {
        PinguLibrary.errorLog(check.client, `Permissions not defined correctly!`, check.content);
        return "Permissions for this script was not defined correctly!";
    }
    for (var x = 0; x < permissions.length; x++) {
        var permString = permissions[x].toLowerCase().replace('_', ' ');
        if (!checkPermisson(check.channel, check.client.user, permissions[x]))
            return `I don't have permission to **${permString}** in ${check.channel.name}.`;
        else if (!checkPermisson(check.channel, check.author, permissions[x]) &&
            (PinguLibrary.isPinguDev(check.author) && PinguClient_1.ToPinguClient(check.client).config.testingMode || !this.isPinguDev(check.author)))
            return `<@${check.author.id}> you don't have permission to **${permString}** in #${check.channel.name}.`;
    }
    return exports.PermissionGranted;
    function checkPermisson(channel, user, permission) {
        return channel.permissionsFor(user).has(permission);
    }
}
exports.PermissionCheck = PermissionCheck;
function Permissions() {
    //let all = Array.from(getPermissions()).reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {});
    let givenStrings = [
        'MANAGE_ROLES',
        'MANAGE_CHANNELS',
        'CHANGE_NICKNAME',
        'VIEW_CHANNEL',
        'SEND_MESSAGES',
        'SEND_TTS_MESSAGES',
        'MANAGE_MESSAGES',
        'EMBED_LINKS',
        'ATTACH_FILES',
        'MANAGE_EMOJIS',
        'READ_MESSAGE_HISTORY',
        'USE_EXTERNAL_EMOJIS',
        'ADD_REACTIONS',
        'CONNECT',
        'SPEAK',
        'USE_VAD',
        'VIEW_AUDIT_LOG'
    ];
    let given = [], missing = [], all = [];
    for (var perm of Array.from(getPermissions())) {
        let permObj = new helpers_1.BitPermission(perm[0], perm[1]);
        if (givenStrings.includes(perm[0]))
            given.push(permObj);
        else
            missing.push(permObj);
        all.push(permObj);
    }
    return { given, missing, all };
    function getPermissions() {
        let temp = new Map();
        let bits = getBitValues();
        for (var prop in helpers_1.DiscordPermissions) {
            temp.set(prop, bits.find(bits => bits.permString == prop).bit);
        }
        return temp;
    }
    function getBitValues() {
        let permissions = Object.keys(helpers_1.DiscordPermissions)
            .map(permString => new helpers_1.BitPermission(permString, 0));
        for (var i = 0; i < permissions.length; i++)
            permissions[i].bit = i == 0 ? 1 : permissions[i - 1].bit * 2;
        return permissions;
    }
}
exports.Permissions = Permissions;
//#endregion
//#region Servers
exports.PinguSupportInvite = `https://discord.gg/gbxRV4Ekvh`;
exports.SavedServers = {
    DanhoMisc(client) {
        return getServer(client, '460926327269359626');
    },
    PinguSupport(client) {
        return getServer(client, '756383096646926376');
    },
    PinguEmotes(client) {
        return getServer(client, '791312245555855401');
    },
    DeadlyNinja(client) {
        return getServer(client, '405763731079823380');
    }
};
function getServer(client, id) {
    return client.guilds.cache.find(g => g.id == id);
}
exports.getServer = getServer;
function getSharedServers(client, user) {
    return __awaiter(this, void 0, void 0, function* () {
        let servers = new Array();
        for (var guild of client.guilds.cache.array()) {
            if (yield guild.members.fetch(user))
                servers.push(guild);
        }
        return servers;
    });
}
exports.getSharedServers = getSharedServers;
class Developer {
    constructor(name, id) {
        this.name = name;
        this.id = id;
    }
}
const developers = [
    new Developer('Danho', '245572699894710272'),
    new Developer('SynthySytro', '405331883157880846'),
    new Developer('Slothman', '290131910091603968'),
    new Developer('DefilerOfCats', '803903863706484756')
];
exports.Developers = new discord_js_1.Collection();
function CacheDevelopers(client) {
    return __awaiter(this, void 0, void 0, function* () {
        for (const developer of developers) {
            let user = yield client.users.fetch(developer.id);
            exports.Developers.set(developer.name, user);
        }
        return exports.Developers;
    });
}
exports.CacheDevelopers = CacheDevelopers;
function isPinguDev(user) {
    return exports.Developers.get(developers.find(dev => dev.id == user.id).name) != null;
}
exports.isPinguDev = isPinguDev;
//#endregion
//#region Channels
function getTextChannel(client, guildID, channelName) {
    var guild = client.guilds.cache.find(guild => guild.id == guildID);
    if (!guild) {
        console.error(`Unable to get guild from ${guildID}`);
        return null;
    }
    var channel = guild.channels.cache.find(channel => channel.name == channelName);
    if (!channel) {
        console.error(`Unable to get channel from ${channelName}`);
        return null;
    }
    return channel;
}
exports.getTextChannel = getTextChannel;
function outages(client, message) {
    return __awaiter(this, void 0, void 0, function* () {
        var outageChannel = getTextChannel(client, '756383096646926376', 'outages');
        if (!outageChannel)
            return DanhoDM(`Couldn't get #outage channel in Pingu Support, ${PinguLibrary.PinguSupportInvite}`);
        consoleLog(client, message);
        let sent = yield outageChannel.send(message);
        return sent.crosspost();
    });
}
exports.outages = outages;
function DanhoDM(message) {
    return __awaiter(this, void 0, void 0, function* () {
        console.error(message);
        let Danho = exports.Developers.get('Danho');
        if (!Danho)
            return;
        return (yield Danho.createDM()).send(message);
    });
}
exports.DanhoDM = DanhoDM;
//#endregion
//#region Log Channels
exports.errorCache = new discord_js_1.Collection();
function errorLog(client, message, messageContent, err, params = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        //Get #error-log
        var errorlogChannel = getTextChannel(client, exports.SavedServers.PinguSupport(client).id, 'error-log-⚠');
        if (!errorlogChannel)
            return DanhoDM(`Unable to find #error-log-⚠️ in Pingu Support, ${exports.PinguSupportInvite}`);
        let errorDir = './errors';
        let errorID = fs.readdirSync(errorDir).filter(file => file.endsWith('.json')).length;
        //Write or append to errorfile
        let errorFilePath = `${errorDir}/${errorID}.json`;
        fs.writeFile(errorFilePath, JSON.stringify({ err, params }, null, 2), () => consoleLog(client, `Created error file for error #${errorID}.`));
        //Send and react
        let sent = yield sendMessage(getErrorMessage(message, messageContent, err));
        let paramsSent = yield sendMessage("```\n[Parameters]:\n" + JSON.stringify(params, null, 2) + "\n```").catch((err) => __awaiter(this, void 0, void 0, function* () {
            if (err.message.includes('Must be 2000 or fewer in length'))
                return yield errorlogChannel.send(new discord_js_1.MessageAttachment(errorFilePath, `Error ${errorID}.json`));
        }));
        //Add to errorCache
        exports.errorCache.set(errorID, [sent, paramsSent]);
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
            consoleLog(client, returnMessage);
            return returnMessage;
        }
        function sendMessage(content) {
            return __awaiter(this, void 0, void 0, function* () {
                console.error(content.includes('`') ? content.replace('`', ' ') : content);
                let sent = yield errorlogChannel.send(content);
                yield sent.react(exports.SavedServers.DanhoMisc(client).emojis.cache.find(e => e.name == 'Checkmark')); //Mark as solved
                yield sent.react('📄'); //Get error file
                //Create reaction handler
                sent.createReactionCollector(() => true).on('collect', (reaction, user) => __awaiter(this, void 0, void 0, function* () {
                    if (!isPinguDev(user) || !reaction.users.cache.has(client.user.id))
                        return reaction.remove();
                    if (reaction.emoji.name == '📄') {
                        let fileMessage = yield reaction.message.channel.send(new discord_js_1.MessageAttachment(errorFilePath, `Error ${errorID}.json`));
                        return exports.errorCache.set(errorID, [...exports.errorCache.get(errorID), fileMessage]);
                    }
                    exports.errorCache.get(errorID).forEach(m => m.delete({ reason: `Error #${errorID}, was marked as solved by ${user.tag}` }));
                    fs.unlink(errorFilePath, () => consoleLog(client, `Deleted error #${errorID}.`));
                }));
                return sent;
            });
        }
    });
}
exports.errorLog = errorLog;
function pGuildLog(client, script, message, err) {
    return __awaiter(this, void 0, void 0, function* () {
        var pinguGuildLog = PinguLibrary.getTextChannel(client, PinguLibrary.SavedServers.PinguSupport(client).id, "pingu-guild-log-🏡");
        if (!pinguGuildLog)
            return PinguLibrary.DanhoDM(`Couldn't get #pingu-guild-log-🏡 in Pingu Support, ${PinguLibrary.PinguSupportInvite}`);
        if (err) {
            var errorLink = (yield errorLog(client, `PinguGuild Error: "${message}"`, null, err)).url;
            return pinguGuildLog.send(`[**Failed**] [**${script}**]: ${message}\n${err.message}\n\n${errorLink}\n\n<@&756383446871310399>`);
        }
        return pinguGuildLog.send(`[**Success**] [**${script}**]: ${message}`);
    });
}
exports.pGuildLog = pGuildLog;
function pUserLog(client, script, message, err) {
    return __awaiter(this, void 0, void 0, function* () {
        var pinguUserLog = PinguLibrary.getTextChannel(client, PinguLibrary.SavedServers.PinguSupport(client).id, "pingu-user-log-🧍");
        if (!pinguUserLog)
            return PinguLibrary.DanhoDM(`Couldn't get #pingu-user-log-🧍 in Pingu Support, ${PinguLibrary.PinguSupportInvite}`);
        if (err) {
            var errorLink = (yield errorLog(client, `PinguUser Error (**${script}**): "${message}"`, null, err)).url;
            return pinguUserLog.send(`[**Failed**] [**${script}**]: ${message}\n${err.message}\n\n${errorLink}\n\n<@&756383446871310399>`);
        }
        return pinguUserLog.send(`[**Success**] [**${script}**]: ${message}`);
    });
}
exports.pUserLog = pUserLog;
function consoleLog(client, message) {
    return __awaiter(this, void 0, void 0, function* () {
        let timeFormat = `[${new Date(Date.now()).toLocaleTimeString()}]`;
        console.log(`${timeFormat} ${message}`);
        let consoleLogChannel = PinguLibrary.getTextChannel(client, PinguLibrary.SavedServers.PinguSupport(client).id, "console-log-📝");
        if (!consoleLogChannel)
            return PinguLibrary.DanhoDM(`Unable to find #console-log-📝 in Pingu Support, ${PinguLibrary.PinguSupportInvite}`);
        consoleLogChannel.send(message);
    });
}
exports.consoleLog = consoleLog;
const handlers_1 = require("../handlers");
const PinguClient_1 = require("../client/PinguClient");
function eventLog(client, content) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!PinguClient_1.ToPinguClient(client).isLive)
            return;
        let eventLogChannel = getTextChannel(client, exports.SavedServers.PinguSupport(client).id, "event-log-📹");
        if (!eventLogChannel)
            return DanhoDM(`Couldn't get #event-log-📹 channel in Pingu Support, ${PinguLibrary.PinguSupportInvite}`);
        let lastCache = handlers_1.LoggedCache[0];
        if (lastCache && (lastCache.description && lastCache.description == content.description ||
            lastCache.fields[0] && content.fields[0] && lastCache.fields[0].value == content.fields[0].value))
            return;
        handlers_1.LoggedCache.unshift(content);
        return yield eventLogChannel.send(content);
    });
}
exports.eventLog = eventLog;
function achievementLog(client, achievementEmbed) {
    return __awaiter(this, void 0, void 0, function* () {
        const achievementChannel = getTextChannel(client, exports.SavedServers.PinguSupport(client).id, 'achievement-log-🏆');
        if (!achievementChannel)
            return DanhoDM(`Couldn't get #achievement-log-🏆 channel in Pingu Support, ${exports.PinguSupportInvite}`);
        return achievementChannel.send(achievementEmbed);
    });
}
exports.achievementLog = achievementLog;
function tellLog(client, sender, reciever, message) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!PinguClient_1.ToPinguClient(client).isLive)
            return;
        var tellLogChannel = getTextChannel(client, exports.SavedServers.PinguSupport(client).id, 'tell-log-💬');
        if (!tellLogChannel)
            return DanhoDM(`Couldn't get #tell-log-💬 channel in Pingu Support, ${PinguLibrary.PinguSupportInvite}`);
        if (message.constructor.name == "Message") {
            var messageAsMessage = message;
            var consoleLogValue = messageAsMessage.content ? `${sender.username} sent a message to ${reciever.username} saying ` :
                messageAsMessage.attachments.array().length == 1 ? `${sender.username} sent a file to ${reciever.username}` :
                    messageAsMessage.attachments.array().length > 1 ? `${sender.username} sent ${messageAsMessage.attachments.array().length} files to ${reciever.username}` :
                        `${sender.username} sent something unknown to ${reciever.username}!`;
            if (messageAsMessage.content)
                consoleLogValue += messageAsMessage.content;
            if (messageAsMessage.attachments)
                consoleLogValue += messageAsMessage.attachments.map(a => `\n${a.url}`);
            consoleLog(client, consoleLogValue);
            var format = (ping) => `${new Date(Date.now()).toLocaleTimeString()} [<@${(ping ? sender : sender.username)}> ➡️ <@${(ping ? reciever : reciever.username)}>]`;
            if (messageAsMessage.content && messageAsMessage.attachments)
                tellLogChannel.send(format(false) + `: ||${messageAsMessage.content}||`, messageAsMessage.attachments.array())
                    .then(sent => sent.edit(format(true) + `: ||${messageAsMessage.content}||`));
            else if (messageAsMessage.content)
                tellLogChannel.send(format(false) + `: ||${messageAsMessage.content}||`)
                    .then(sent => sent.edit(format(true) + `: ||${messageAsMessage.content}||`));
            else if (messageAsMessage.attachments)
                tellLogChannel.send(format(false), messageAsMessage.attachments.array())
                    .then(sent => sent.edit(format(true)));
            else
                errorLog(client, `${sender} ➡️ ${reciever} sent something that didn't have content or attachments`, message.constructor.name == 'Message' ? message.content : message.description, null, {
                    params: { client, sender, reciever, message },
                    additional: { tellLogChannel, consoleLogValue }
                }).then(() => tellLogChannel.send(`Ran else statement - I've contacted my developers!`));
        }
        else if (message.constructor.name == "MessageEmbed") {
            consoleLog(client, `The link between ${sender.username} & ${reciever.username} was unset.`);
            tellLogChannel.send(message);
        }
    });
}
exports.tellLog = tellLog;
function latencyCheck(message) {
    return __awaiter(this, void 0, void 0, function* () {
        //Get latency
        let pingChannel = getTextChannel(message.client, exports.SavedServers.PinguSupport(message.client).id, "ping-log-🏓");
        if (!pingChannel)
            return DanhoDM(`Couldn't get #ping-log-🏓 channel in Pingu Support, ${exports.PinguSupportInvite}`);
        if (message.channel == pingChannel || message.author.bot)
            return null;
        let pingChannelSent = yield pingChannel.send(`Calculating ping`);
        let latency = pingChannelSent.createdTimestamp - message.createdTimestamp;
        pingChannelSent.edit(latency + 'ms');
        //Get outages channel
        let outages = getTextChannel(message.client, exports.SavedServers.PinguSupport(message.client).id, "outages-😵");
        if (!outages)
            return errorLog(message.client, `Unable to find #outages-😵 channel from LatencyCheck!`);
        //Set up to find last Pingu message
        let outagesMessages = outages.messages.cache.array();
        let outageMessagesCount = outagesMessages.length - 1;
        //Find Pingu message
        for (var i = outageMessagesCount - 1; i >= 0; i--) {
            if (outagesMessages[i].author != message.client.user)
                continue;
            var lastPinguMessage = outagesMessages[i];
        }
        if (!lastPinguMessage)
            return null;
        let sendMessage = !lastPinguMessage.content.includes(`I have a latency delay on`);
        if (!sendMessage) {
            let lastMessageArgs = lastPinguMessage.content.split(` `);
            let lastLatencyExclaim = lastMessageArgs[lastMessageArgs.length - 1];
            let lastLatency = parseInt(lastLatencyExclaim.substring(0, lastLatencyExclaim.length - 1));
            if (lastLatency > 1000)
                return lastPinguMessage.edit(`I have a latency delay on ${latency}!`);
        }
        if (latency > 1000)
            PinguLibrary.outages(message.client, `I have a latency delay on ${latency}!`);
    });
}
exports.latencyCheck = latencyCheck;
function raspberryLog(client) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!PinguClient_1.ToPinguClient(client).isLive)
            return;
        let raspberryLogChannel = getTextChannel(client, exports.SavedServers.PinguSupport(client).id, 'raspberry-log-🍇');
        if (!raspberryLogChannel)
            return DanhoDM(`Couldn't get #raspberry-log-🍇 channel in Pingu Support, ${exports.PinguSupportInvite}`);
        return raspberryLogChannel.send(`Pulled version ${PinguClient_1.ToPinguClient(client).config.version} from Github`);
    });
}
exports.raspberryLog = raspberryLog;
const UserAchievement_1 = require("../achievements/items/UserAchievement");
const GuildMemberAchievement_1 = require("../achievements/items/GuildMemberAchievement");
const GuildAchievement_1 = require("../achievements/items/GuildAchievement");
const PinguUser_1 = require("../user/PinguUser");
const PinguGuildMember_1 = require("../guildMember/PinguGuildMember");
const PinguGuild_1 = require("../guild/PinguGuild");
const PAchievement_1 = require("../../database/json/PAchievement");
const UserAchievementConfig_1 = require("../achievements/config/UserAchievementConfig");
const GuildMemberAchievementConfig_1 = require("../achievements/config/GuildMemberAchievementConfig");
const GuildAchievementConfig_1 = require("../achievements/config/GuildAchievementConfig");
function AchievementCheckType(client, achieverType, achiever, key, keyType, config) {
    return __awaiter(this, void 0, void 0, function* () {
        const filter = (arr) => arr.filter(i => i.key == key && i.type == keyType);
        let allAchievements = filter((function getAllAchievements() {
            switch (achieverType) {
                case 'USER': return UserAchievement_1.UserAchievement.Achievements;
                case 'GUILDMEMBER': return GuildMemberAchievement_1.GuildMemberAchievement.Achievements;
                case 'GUILD': return GuildAchievement_1.GuildAchievement.Achievements;
                default: return null;
            }
        })());
        if (!allAchievements)
            return null;
        let pAchievements = (yield (function getAllPAchievements() {
            return __awaiter(this, void 0, void 0, function* () {
                switch (achieverType) {
                    case 'USER': return (yield PinguUser_1.GetPUser(achiever)).achievementConfig.achievements;
                    case 'GUILDMEMBER': return (yield PinguGuildMember_1.GetPGuildMember(achiever)).achievementsConfig.achievements;
                    case 'GUILD': return (yield PinguGuild_1.GetPGuild(achiever)).settings.config.achievements.achievements;
                    default: return null;
                }
            });
        })()).map(pa => pa._id);
        let achievement = allAchievements.find(a => !pAchievements.includes(a._id));
        if (!achievement)
            return null;
        let pAchievement = new PAchievement_1.PAchievement({
            _id: achievement._id,
            achievedAt: new Date(Date.now())
        });
        yield (function UpdateDB() {
            return __awaiter(this, void 0, void 0, function* () {
                const scriptName = 'PinguLibrary.AchievementCheckType()';
                switch (achieverType) {
                    case 'USER':
                        let pUser = yield PinguUser_1.GetPUser(achiever);
                        pUser.achievementConfig.achievements.push(pAchievement);
                        return PinguUser_1.UpdatePUser(client, { achievementConfig: pUser.achievementConfig }, pUser, scriptName, `Added ${achieverType.toLowerCase()} achievement, #${pAchievement._id} "${achievement.name}" to **${achiever.tag}**'s PinguUser achievements collection`, `Failed to add ${achieverType.toLowerCase()} achievement, #${pAchievement._id} "${achievement.name}" to **${achiever.tag}**'s PinguUser achievements collection`);
                    case 'GUILDMEMBER':
                        let pGuildMember = yield PinguGuildMember_1.GetPGuildMember(achiever);
                        pGuildMember.achievementsConfig.achievements.push(pAchievement);
                        return PinguGuildMember_1.UpdatePGuildMember(achiever, pGuildMember, scriptName, `Added ${achieverType.toLowerCase()} achievement, #${pAchievement._id} "${achievement.name}" to **${achiever.user.tag}**'s PinguGuildMember achievements collection`, `Failed to add ${achieverType.toLowerCase()} achievement, #${pAchievement._id} "${achievement.name}" to **${achiever.user.tag}**'s PinguGuildMember achievements collection`);
                    case 'GUILD':
                        let pGuild = yield PinguGuild_1.GetPGuild(achiever);
                        pGuild.settings.config.achievements.achievements.push(pAchievement);
                        return PinguGuild_1.UpdatePGuild(client, { settings: pGuild.settings }, pGuild, scriptName, `Added ${achieverType.toLowerCase()} achievement, #${pAchievement._id} "${achievement.name}" to **${achiever.name}**'s PinguGuild achievements collection`, `Failed to add ${achieverType.toLowerCase()} achievement, #${pAchievement._id} "${achievement.name}" to **${achiever.name}**'s PinguGuild achievements collection`);
                    default: return null;
                }
            });
        })();
        return (function notify() {
            switch (achieverType) {
                case 'USER': return UserAchievementConfig_1.UserAchievementConfig.notify(client, achiever, achievement);
                case 'GUILDMEMBER': return GuildMemberAchievementConfig_1.GuildMemberAchievementConfig.notify(client, achiever, achievement, config);
                case 'GUILD': return GuildAchievementConfig_1.GuildAchievementConfig.notify(client, achiever, achievement, config);
                default: return null;
            }
        })();
    });
}
exports.AchievementCheckType = AchievementCheckType;
function AchievementCheck(client, data, key, type) {
    return __awaiter(this, void 0, void 0, function* () {
        let pUser = yield PinguUser_1.GetPUser(data.user);
        let givenAchievement = AchievementCheckType(client, 'USER', data.user, key, type, pUser.achievementConfig);
        if (data.guild) {
            let pGuild = yield PinguGuild_1.GetPGuild(data.guild);
            givenAchievement !== null && givenAchievement !== void 0 ? givenAchievement : AchievementCheckType(client, 'GUILD', data.guild, key, type, pGuild.settings.config.achievements);
        }
        if (data.guildMember) {
            let pGuildMember = yield PinguGuildMember_1.GetPGuildMember(data.guildMember);
            givenAchievement !== null && givenAchievement !== void 0 ? givenAchievement : AchievementCheckType(client, 'GUILDMEMBER', data.guildMember, key, type, pGuildMember.achievementsConfig);
        }
        return givenAchievement != null;
    });
}
exports.AchievementCheck = AchievementCheck;
//#endregion
//#region Statics
const helpers_2 = require("../../helpers");
Object.defineProperty(exports, "BlankEmbedField", { enumerable: true, get: function () { return helpers_2.BlankEmbedField; } });
const database_1 = require("../../database");
Object.defineProperty(exports, "DBExecute", { enumerable: true, get: function () { return database_1.DBExecute; } });
function getImage(script, imageName) {
    return `./embedImages/${script}/${imageName}.png`;
}
exports.getImage = getImage;
function getEmote(client, name, emoteGuild) {
    if (!client || !name || !emoteGuild)
        return '😵';
    let emote = client.guilds.cache.find(g => g.id == emoteGuild.id).emojis.cache.find(e => e.name == name);
    if (emote)
        return emote;
    errorLog(client, `Unable to find Emote **${name}** from ${emoteGuild.name}`, null, null, {
        params: { client, name, emoteGuild }
    });
    return '😵';
}
exports.getEmote = getEmote;
function RequestImage(message, pGuildClient, caller, types, searchTerm) {
    return __awaiter(this, void 0, void 0, function* () {
        const client = PinguClient_1.ToPinguClient(message.client);
        const { config } = client;
        if (!config || !config.api_key || !config.google_custom_search) {
            return errorLog(client, `Unable to send ${caller}\nImage search requires both a YouTube API key and a Google Custom Search key!`, message.content, null, {
                params: { message, pGuildClient, caller, types },
                additional: { api_key: config.api_key, google_custom_search: config.google_custom_search }
            }).then(() => message.channel.send(`I was unable to search for a ${type}! I have contacted my developers...`));
        }
        // gets us a random result in first 5 pages
        const page = 1 + Math.floor(Math.random() * 5) * 10;
        //const type = Math.floor(Math.random() * 2) == 1 ? "Club Penguin" : "Pingu";
        const type = types[Math.floor(Math.random() * types.length)];
        if (!searchTerm)
            searchTerm = type => `${type} ${caller}`;
        // we request 10 items
        request(`https://www.googleapis.com/customsearch/v1?key=${config.api_key}&cx=${config.google_custom_search}&q=${searchTerm(type)}&searchType=image&alt=json&num=10&start=${page}`, (err, res, body) => __awaiter(this, void 0, void 0, function* () {
            if (err)
                return errorLog(client, `Error getting results when searching for ${searchTerm(type)}`, message.content, new helpers_1.Error(err), {
                    params: { message, pGuildClient, caller, types },
                    additional: {
                        page, type,
                        keys: {
                            api_key: config.api_key,
                            google_custom_search: config.google_custom_search
                        }
                    }
                });
            // "https://www.googleapis.com/customsearch/v1?key=AIzaSyAeAr2Dv1umzuLes_zhlY0lON4Pf_uAKeM&cx=013524999991164939702:z24cpkwx9nz&q=pinguh&searchType=image&alt=json&num=10&start=31"
            try {
                var data = JSON.parse(body);
            }
            catch (err) {
                errorLog(client, `Getting data in ${caller}, PinguLibrary.RequestImage()`, message.content, new helpers_1.Error(err), {
                    params: { message, pGuildClient, caller, types },
                    additional: { page, type, data }
                });
            }
            if (!data) {
                return errorLog(client, `Getting data in ${caller}, PinguLibrary.RequestImage()`, message.content, null, {
                    params: { message, pGuildClient, caller, types },
                    additional: { page, type, data }
                }).then(() => message.channel.send(`I was unable to recieve a gif! I have contacted my developers...`));
            }
            else if (!data.items || !data.items.length) {
                return errorLog(client, `Data for ${caller} has no items`, message.content, null, {
                    params: { message, pGuildClient, caller, types },
                    additional: { page, type, data }
                }).then(() => message.channel.send(`I was unable to find a gif! I have contacted my developers...`));
            }
            return message.channel.send(new discord_js_1.MessageEmbed()
                .setImage(data.items[Math.floor(Math.random() * data.items.length)].link)
                .setColor(pGuildClient.embedColor || client.DefaultEmbedColor));
        }));
    });
}
exports.RequestImage = RequestImage;
//#endregion
class PinguLibrary {
    //#region Permissions
    static PermissionCheck(check, ...permissions) { return PermissionCheck(check, ...permissions); }
    static Permissions() { return Permissions(); }
    static getSharedServers(client, user) {
        return __awaiter(this, void 0, void 0, function* () { return getSharedServers(client, user); });
    }
    static CacheDevelopers(client) {
        return __awaiter(this, void 0, void 0, function* () { return CacheDevelopers(client); });
    }
    static isPinguDev(user) { return isPinguDev(user); }
    //#endregion
    //#region Channels
    static getTextChannel(client, guildID, channelName) { return getTextChannel(client, guildID, channelName); }
    static outages(client, message) {
        return __awaiter(this, void 0, void 0, function* () { return outages(client, message); });
    }
    static DanhoDM(message) {
        return __awaiter(this, void 0, void 0, function* () { return DanhoDM(message); });
    }
    static errorLog(client, message, messageContent, err, params = {}) {
        return __awaiter(this, void 0, void 0, function* () { return errorLog(client, message, messageContent, err, params); });
    }
    static pGuildLog(client, script, message, err) {
        return __awaiter(this, void 0, void 0, function* () { return pGuildLog(client, script, message, err); });
    }
    static pUserLog(client, script, message, err) {
        return __awaiter(this, void 0, void 0, function* () { return pUserLog(client, script, message, err); });
    }
    static consoleLog(client, message) {
        return __awaiter(this, void 0, void 0, function* () { return consoleLog(client, message); });
    }
    static eventLog(client, content) {
        return __awaiter(this, void 0, void 0, function* () { return eventLog(client, content); });
    }
    static tellLog(client, sender, reciever, message) {
        return __awaiter(this, void 0, void 0, function* () { return tellLog(client, sender, reciever, message); });
    }
    static latencyCheck(message) {
        return __awaiter(this, void 0, void 0, function* () { return latencyCheck(message); });
    }
    static raspberryLog(client) {
        return __awaiter(this, void 0, void 0, function* () { return raspberryLog(client); });
    }
    //#endregion
    //#region Achievement
    static AchievementCheck(client, data, key, type) {
        return __awaiter(this, void 0, void 0, function* () {
            return AchievementCheck(client, data, key, type);
        });
    }
    //#endregion
    //#region Statics
    static getEmote(client, name, emoteGuild) { return getEmote(client, name, emoteGuild); }
    static getImage(script, imageName) { return getImage(script, imageName); }
    static DBExecute(client, callback) {
        return __awaiter(this, void 0, void 0, function* () { return database_1.DBExecute(client, callback); });
    }
    static BlankEmbedField(inline = false) { return helpers_2.BlankEmbedField(inline); }
    static RequestImage(message, pGuildClient, caller, types, searchTerm) {
        return __awaiter(this, void 0, void 0, function* () { return RequestImage(message, pGuildClient, caller, types, searchTerm); });
    }
}
exports.PinguLibrary = PinguLibrary;
PinguLibrary.PermissionGranted = exports.PermissionGranted;
//#endregion
//#region Servers
PinguLibrary.PinguSupportInvite = exports.PinguSupportInvite;
PinguLibrary.SavedServers = exports.SavedServers;
//#endregion
//#region Pingu Developers
PinguLibrary.Developers = exports.Developers;
//#endregion
//#region Log Channels
PinguLibrary.errorCache = exports.errorCache;
