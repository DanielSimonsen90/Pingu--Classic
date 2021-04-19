const { MessageEmbed } = require("discord.js");
const {
    PinguGuild, PinguLibrary, PinguUser, PClient, PinguEvent, PinguGuildMember, PinguClient,
    DiscordPermissions, Error, CommandCategories
} = require("PinguPackage");
const { HandleTell, ExecuteTellReply } = require('../../commands/2 Fun/Pingu User/tell');
const { CheckRoleChange } = require("../guild/role/roleUpdate");

module.exports = new PinguEvent('message',
    async function setContent({ content, id, url, channel, type, guild, attachments, tts, embeds, mentions }) {
        const { EmbedField } = require('PinguPackage');
        try {
            return module.exports.content = new MessageEmbed()
                .setDescription(content ? `"${content}"` : "")
                .addFields([
                    new EmbedField(`ID`, id, true),
                    new EmbedField(`URL`, url, true),
                    new EmbedField(`Channel`, channel, true),
                    new EmbedField(`Type`, type, true),
                    new EmbedField(`Guild`, guild && guild.name || "DMs", true),
                    new EmbedField(`Attachments?`, attachments.first() != null, true),
                    new EmbedField(`Embeds?`, embeds[0] != null, true),
                    new EmbedField(`TTS?`, tts, true),
                    new EmbedField(`Mentions?`, GetMentions(), true)
                ]);
        } catch (err) {
            console.log();
        }

        function GetMentions() {
            const { channels, roles, users, everyone } = mentions;
            let result = [];

            if (channels.first()) result.push(`${channels.size} channel${(channels.size > 1 ? 's' : '')}`);
            if (roles.first()) result.push(`${roles.size} roles${(roles.size > 1 ? 's' : '')}`);
            if (users.first()) result.push(`${users.size} users${(users.size > 1 ? 's' : '')}`);
            if (everyone) result.push(`\`@everyone\``);

            if (result.length > 0) {
                return `Mentioned ` + result.join(`, `);
            }
            return `No mentions`;
        }
    },
    async function execute(client, message) {
        const { content, channel, guild, author, member } = message;

        //Log latency
        PinguLibrary.latencyCheck(message)
            .catch(err => PinguLibrary.errorLog(client, `LatencyCheck error`, content, err, { params: message }));

        //User sent a message in #emotes, and is expecitng an emote to be made
        if (await fromEmotesChannel()) return;

        //Assign prefix
        let prefix = guild ? await HandlePGuild() : client.DefaultPrefix;

        //Split prefix from message content
        let args = content.slice(prefix.length).split(/ +/);

        //Get commandName
        let commandName = args.shift();

        //If mentioned without prefix
        if (content && content.includes(client.user.id) && !args.length && !author.bot)
            return channel.send(`My prefix is \`${prefix}\``);

        //If interacted via @
        commandName = TestTagInteraction();

        var startsWithPrefix = content.startsWith(prefix) && !author.bot || content && content.includes(client.id);

        //If I'm not interacted with don't do anything
        if (channel.type == 'dm' && (author.bot || (await PinguUser.Get(author)).replyPerson) && (!startsWithPrefix || commandName && commandName.includes(prefix)))
            return ExecuteTellReply(message).catch(err => PinguLibrary.errorLog(client, `Failed to execute tell reply`, content, err, {
                params: { message },
                additional: { prefix, args, commandName, startsWithPrefix }
            }));

        if (!startsWithPrefix) return;

        //Attempt "command" assignment
        let command = AssignCommand();
        if (!command) return;

        //Decode command
        let decoded = DecodeCommand();
        if (!decoded.value) return decoded.type == 'text' ? channel.send(decoded.message) : author.send(decoded.message);

        //Execute command and log it
        ExecuteAndLogCommand();

        //Check if message.content gives a CHAT achievement
        AchievementCheck();

        async function fromEmotesChannel() {
            if (!guild || author.bot || !channel.name.includes('emote') || !channel.name.includes('emoji')) return false;

            let permCheck = PinguLibrary.PermissionCheck(message, 'MANAGE_EMOJIS', 'SEND_MESSAGES')
            if (permCheck != PinguLibrary.PermissionGranted) {
                message.channel.send(permCheck);
                return false;
            }

            if (!client.isLive && guild.members.cache.has(PinguClient.Clients.PinguID)) return false;

            const { attachments } = message;
            for (var file of attachments.array()) {
                let errMsg = "";

                let emote = file && file.attachment;
                let name = content && content.replace(' ', '_') || file && file.name.split('.')[0];

                if (!file) errMsg = "No file attatched!";
                else if (!emote) errMsg = "No suitable emote attachment!";
                else if (!name) errMsg = "No name provided!";

                if (errMsg) {
                    channel.send(errMsg);
                    return false;
                }
                var newEmote = await guild.emojis.create(emote, name).catch(err => {
                    channel.send(err.message);
                    return null;
                });
                if (!newEmote) continue;

                channel.send(`${newEmote} was created!`);
                PinguLibrary.consoleLog(client, `Created :${newEmote.name}: for ${guild.name}`);
            }
            return true;
        }
        async function HandlePGuild() {
            //Get PinguGuild from MongolDB
            let pGuild = await PinguGuild.Get(guild);

            //If pGuild wasn't found, create pGuild
            if (!pGuild) {
                PinguLibrary.pGuildLog(client, module.exports.name, `Unable to find pGuild for **${guild.name}**! Creating one now...`)
                await PinguGuild.Write(client, message.guild, module.exports.name, `**${guild.name}** did not have a PinguGuild.`)
                return client.DefaultPrefix;
            }
            else if (pGuild.name != guild.name) client.emit('guildUpdate', { name: pGuild.name, client, id: pGuild._id }, guild);

            let pGuildClient = client.toPClient(pGuild), clientIndex = client.isLive ? 0 : 1;

            if (!pGuildClient) {
                pGuildClient = pGuild.clients[clientIndex] = new PClient(client, guild);
                await PinguGuild.Update(client, ['clients'], pGuild, module.exports.name, `Added ${client.user.tag} to ${pGuild.name}'s PinguGuild`);
            }

            if (pGuildClient.embedColor != guild.me.roles.cache.find(botRoles => botRoles.managed).color)
                CheckRoleChange(guild, pGuild, module.exports.name);
            return pGuildClient.prefix || client.DefaultPrefix
        }
        function TestTagInteraction() {
            return commandName = commandName.indexOf(client.id) ? args.shift() : commandName;
        }
        function AssignCommand() {
            let command = client.commands.get(commandName);
            if (command) return command;

            let commands = client.commands.array();
            command = commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName))
            if (command) {
                //Music alias was used
                if (command.name == 'music') {
                    args.unshift(commandName);
                    commandName = command.name;
                }

                return command;
            }

            //If command assignment failed, assign command
            commandName = args[0] && args[0].toLowerCase();
            if (!commandName) return null;

            return command = client.commands.get(commandName) || commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
        }
        function DecodeCommand() {
            let returnValue = {
                type: message.channel.type,
                value: false,
                message: PinguLibrary.PermissionGranted,

                /**@param {string} message*/
                setMessage(message) {
                    this.message = message;
                    return this;
                },
                /**@param {boolean} value*/
                setValue(value) {
                    this.value = value;
                    return this;
                }
            }

            //If guildOnly
            if (command.guildOnly && !guild)
                return returnValue.setMessage(`That command can only be executed in servers!`);

            //If GuildSpecific
            if (command.category == CommandCategories.GuildSpecific) {
                if (!guild) return returnValue.setMessage(`That command can only be used in a specific server!`);
                if (command.specificGuildID != guild.id)
                    return returnValue.setMessage(`That command cannot be used in this server!`);
            }

            //If DevOnly
            if (command.category == CommandCategories.DevOnly && !PinguLibrary.isPinguDev(author))
                return returnValue.setMessage(`Who do you think you are exactly?`);
            else if (command.mustBeBeta && client.isLive)
                return returnValue.setMessage(`${client.DefaultPrefix}test should only be used on <@${PinguClient.Clients.PinguID}>.`);

            //Permission check for required permissions
            if (channel.type != 'dm' && command.permissions) {
                let permCheck = PinguLibrary.PermissionCheck(message, ...(command.permissions.includes('SEND_MESSAGES') ? command.permissions : [...command.permissions, 'SEND_MESSAGES']));
                if (permCheck != PinguLibrary.PermissionGranted)
                    return returnValue.setMessage(permCheck);
            }
            return returnValue.setValue(true);
        }
        async function ExecuteAndLogCommand() {
            let ConsoleLog = `User **${author.username}** executed command **${commandName}**, from ${(!guild ? `DMs and ` : `"${guild}", #${channel.name}, and `)}`;

            //Attempt execution of command
            try {
                if (commandName == "tell") await HandleTell(message, args);

                var [pGuild, pGuildMember, pAuthor] = await Promise.all([
                    guild ? PinguGuild.Get(guild) : null,
                    member ? PinguGuildMember.Get(member) : null,
                    PinguUser.Get(author)
                ]);
                pAuthor = !pAuthor ? await PinguUser.Write(client, author, module.exports.name, `${message.author} did not have a PinguUser entry`) : pAuthor;

                var pGuildClient = guild && pGuild ? client.toPClient(pGuild) : null
                var parameters = { client, message, args, pGuild, pAuthor, pGuildMember, pGuildClient }

                let achievementParams = { ...parameters, response: await command.execute(parameters) };
                ConsoleLog += `**succeeded!**`;

                const achieverClasses = { user: author, guildMember: member, guild };

                PinguLibrary.AchievementCheck(client, achieverClasses, 'COMMAND', command.name).catch(err => {
                    PinguLibrary.errorLog(client, `Handling COMMAND achievement check`, content, err, {
                        params: achievementParams,
                        additional: { achieverClasses }
                    })
                })
            } catch (err) {
                if (err.message == 'Missing Access' && guild.id == PinguLibrary.SavedServers.PinguEmotes(client).id && await FindPermission())
                    return; //Error occured, but cycled through permissions to find missing permission

                ConsoleLog += `**failed!**\nError: ${err}`;

                PinguLibrary.errorLog(client, `Trying to execute "${command.name}"!`, content, err, {
                    params: { message },
                    additional: { args, ConsoleLog, commandName, command },
                    trycatch: { pAuthor, pGuild, pGuildMember, pGuildClient }
                });
            }
            console.log(" ");
            PinguLibrary.consoleLog(client, ConsoleLog);
            async function FindPermission() {
                //Find Danho and make check variable, to bypass "You don't have that permission!" (gotta abuse that PinguDev power)
                let check = {
                    author: PinguLibrary.Developers.get('Danho'),
                    channel, client, content
                };

                //Check if client has permission to Manage Roles in Pingu Emote Server
                let hasManageRoles = PinguLibrary.PermissionCheck(check, 'MANAGE_ROLES') == PinguLibrary.PermissionGranted;
                if (hasManageRoles != PinguLibrary.PermissionGranted) return channel.send(hasManageRoles);

                let roles = {
                    clientRole: guild.me.roles.cache.find(r => r.managed),
                    adminRole: guild.roles.cache.find(r => r.name == `Pingu's Admin Permission`)
                };
                let permissionInfo = {
                    discordPermissions: Object.keys(DiscordPermissions).filter(permissionString => permissionString != DiscordPermissions.ADMINISTRATOR),
                    permission: "Missing Permission",
                    originalPermissions: roles.clientRole.permissions
                };

                for (let i = 0; permissionInfo.permission != "Missing Permission" || i == permissionInfo.discordPermissions.length - 1; i++) {
                    //Find new permission and check if client already has that permission
                    let permission = permissionInfo.discordPermissions[i];
                    let hasPermission = PinguLibrary.PermissionCheck(check, permission) == PinguLibrary.PermissionGranted;
                    if (hasPermission) continue;

                    //Give Administrator permission
                    await guild.me.roles.add(roles.adminRole);

                    //Add the new permission onto original permissions
                    let newPermissions = permissionInfo.originalPermissions.add(permission);
                    await roles.clientRole.setPermissions(newPermissions);

                    //Execute command again
                    try {
                        await command.execute(parameters);

                        //Command was executed with no error, so we have our missing permission
                        permissionInfo.permission = permission;
                    }
                    catch (err) {
                        //Another error occured, but we found the missing permission
                        if (err.message != 'Missing Access') {
                            PinguLibrary.errorLog(client, `Looked for missing permission, but ran into another error`, content, new Error(err), {
                                params: { message },
                                additional: {
                                    command, params: parameters,
                                    findPermissions: {
                                        check, roles, permissionInfo,
                                        loop: { i, permission, hasPermission, newPermissions }
                                    },
                                }
                            });
                            permissionInfo.permission = permission;
                        }
                    }
                    //Reset permissions to original permisssions
                    finally { roles.clientRole.setPermissions(permissionInfo.originalPermissions); }
                }

                //If we cycled through all permissions with no luck
                if (permissionInfo.permission == "Missing Permission") {
                    return channel.send(`Attempted to find missing permission to execute ${command.name}, but ran out of permissions to check! Am I mising more than 1 permission?`);
                }

                return channel.send(`I'm missing the **${permissionInfo.permission}** permission to execute **${command.name}**!`);
            }
        }
        /**@param {'CHAT' | 'CHANNEL'} key*/
        async function AchievementCheck(key) {
            const { UserAchievement, GuildMemberAchievement, GuildAchievement } = require('PinguPackage');
            const Achievements = [
                ...UserAchievement.Achievements,
                ...GuildMemberAchievement.Achievements,
                ...GuildAchievement.Achievements
            ].filter(a => a.key == key);

            if (!Achievements.length) return false;

            const achievement = Achievements.find(a => content.includes(a.type) && a.callback((key == 'CHAT' ? [content, message] : [channel])));
            if (!achievement) return false;

            return PinguLibrary.AchievementCheck(client, { user: author, guildMember: member, guild }, key, achievement.type, [content]);
        }
    }
);