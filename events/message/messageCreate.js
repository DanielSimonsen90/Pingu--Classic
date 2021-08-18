﻿const { PClient, PinguEvent, DiscordPermissions, Error, Arguments } = require("PinguPackage");
const { HandleTell, ExecuteTellReply } = require('../../commands/2 Fun/Pingu User/tell');
const { CheckRoleChange } = require("../guild/role/roleUpdate");

module.exports = new PinguEvent('messageCreate',
    async function setContent(client, embed, { content, id, url, channel, type, guild, attachments, tts, embeds, mentions }) {
        const { EmbedField } = require('PinguPackage');
        try {
            let mentions = GetMentions();
            let fields = [
                new EmbedField(`Id`, id, true),
                new EmbedField(`Channel`, channel, true),
                new EmbedField(`Guild`, guild && guild.name || "DMs", true),
                type != 'DEFAULT' ? 
                    new EmbedField(`Type`, type, true) : 
                    null,
                attachments.first() ? 
                    new EmbedField(`Attachments`, attachments.first() != null, true) : 
                    null,
                embeds[0] ? 
                    new EmbedField(`Embeds`, embeds[0] != null, true) : 
                    null,
                tts ? 
                    new EmbedField(`TTS`, tts, true) : 
                    null,
                mentions != 'No mentions' ? 
                    new EmbedField(`Mentions`, mentions, true) : 
                    null
            ].filter(v => v);

            let emptyFieldsToAdd = Math.round(fields.length % 3);
            for (var i = 0; i < emptyFieldsToAdd; i++) fields.push(EmbedField.Blank(true));

            return module.exports.content = embed.setURL(url).setDescription(content || '').setFields(fields);
        } catch (err) {
            console.log(err);
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
        if (!content) return;

        //User sent a message in #emotes, and is expecitng an emote to be made
        if (await fromEmotesChannel()) return;

        //Assign prefix
        let prefix = !author.bot && guild ? await HandlePGuild() : client.DefaultPrefix;

        //Split prefix from message content
        let args = new Arguments(...content.slice(prefix.length).split(/ +/));

        //Get commandName
        let commandName = args.shift().toLowerCase();

        //If mentioned without prefix
        if (content?.includes(client.id) && !args.length && !author.bot)
            return channel.send(`My prefix is \`${prefix}\``);

        //If interacted via @
        commandName = TestTagInteraction();

        var startsWithPrefix = content.startsWith(prefix) && !author.bot || content?.includes(client.id);
        let pAuthor = client.pUsers.get(author);

        //If I'm not interacted with don't do anything
        if (channel.type == 'DM' && (author.bot || pAuthor?.replyPerson) && (!startsWithPrefix || commandName?.includes(prefix)))
            return ExecuteTellReply(message).catch(err => client.log('error', `Failed to execute tell reply`, content, err, {
                params: { message },
                additional: { prefix, args, commandName, startsWithPrefix }
            }));

        if (!startsWithPrefix) return;

        //Attempt "command" assignment
        let command = AssignCommand();
        if (!command) return;

        //Decode command
        let decoded = DecodeCommand();
        if (!decoded.value) return decoded.type == 'GUILD_TEXT' ? channel.send(decoded.message) : author.send(decoded.message);

        //Execute command and log it
        ExecuteAndLogCommand();

        //Check if message.content gives a CHAT achievement
        AchievementCheck();

        async function fromEmotesChannel() {
            if (!guild || author.bot || (!channel.name.includes('emote') && !channel.name.includes('emoji'))) return false;
            if (!client.isLive && guild.members.cache.has(client.clients.get('Live').id)) return false;

            let permCheck = client.permissions.checkFor(message, 'MANAGE_EMOJIS', 'SEND_MESSAGES')
            if (permCheck != client.permissions.PermissionGranted) {
                message.channel.send(permCheck);
                return false;
            }

            for (var file of message.attachments.array()) {
                
                let emote = file?.attachment;
                let name = content?.replace(/ +/, '_') || file?.name.split('.')[0];
                let errMsg = !file ? "No file attached!" : !emote ? "No suitable emote attachment!" : !name ? "No name provided!" : "";
                
                if (errMsg) {
                    channel.send(errMsg);
                    return false;
                }
                var newEmote = await guild.emojis.create(emote, name).catch(err => {
                    if (err.message.endsWith('image: File cannot be larger than 256.0 kb.')) {
                        var issue = err.message.split(':')[0];
                        let fileSplit = file.url.split('.');
                        let fileExtension = fileSplit[fileSplit.length - 1];
                        let compressOrDieUrl = 'https://compress-or-die.com/' +
                            (['jpeg', 'jpg'].includes(fileExtension) ? 'jpg' : fileExtension);

                        const reply = `${issue.substring(0, issue.length - 1)}\nTry compressing the file using: ${compressOrDieUrl}`;
                        channel.send(reply);
                        return null;
                    }
                    channel.send(err.message);
                    return null;
                });
                if (!newEmote) continue;

                channel.send(`${newEmote} was created!`);
                client.log('console', `Created ${newEmote} for ${guild.name}`);
            }
            return true;
        }
        async function HandlePGuild() {
            let pGuild = client.pGuilds.get(guild) || await client.pGuilds.fetch(guild, module.exports.name, `${guild.name} wasn't cached.`);

            //If pGuild wasn't found, create pGuild
            if (!pGuild) {
                client.log('pGuild', module.exports.name, `Unable to find pGuild for **${guild.name}**! Creating one now...`);
                await client.pGuilds.add(guild, module.exports.name, `**${guild.name}** did not have a PinguGuild.`);
                return client.DefaultPrefix;
            }
            else if (pGuild.name != guild.name) client.emit('guildUpdate', { name: pGuild.name, client, id: pGuild._id }, guild);

            let pGuildClient = client.toPClient(pGuild), clientIndex = client.isLive ? 0 : 1;

            if (!pGuildClient) {
                pGuildClient = pGuild.clients[clientIndex] = new PClient(client, guild);
                await client.pGuilds.update(pGuild, module.exports.name, `Added ${client.user.tag} to ${pGuild.name}'s PinguGuild`)
            }

            const botRole = guild.me.roles.cache.find(r => r.managed);
            if (botRole && pGuildClient.embedColor != botRole.color)
                CheckRoleChange(client, guild, pGuild, module.exports.name);
            return pGuildClient.prefix || client.DefaultPrefix
        }
        function TestTagInteraction() {
            return commandName.includes(client.id) ? args.shift() : commandName;
        }
        function AssignCommand() {
            let command = client.commands.get(commandName);
            if (command) return command;

            let commands = client.commands.array();
            command = commands.find(cmd => cmd.aliases?.some(alias => alias == commandName))
            if (command) return command;

            //If command assignment failed, assign command
            commandName = args[0]?.toLowerCase();
            if (!commandName) return null;

            return command = client.commands.get(commandName) || commands.find(cmd => cmd.aliases?.includes(commandName));
        }
        function DecodeCommand() {
            let returnValue = {
                type: message.channel.type,
                value: false,
                message: client.permissions.PermissionGranted,

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
            if (command.category == 'GuildSpecific') {
                if (!guild) return returnValue.setMessage(`That command can only be used in a specific server!`);
                if (command.specificGuildID != guild.id)
                    return returnValue.setMessage(`That command cannot be used in this server!`);
            }

            //If DevOnly
            if (command.category == 'DevOnly' && !client.developers.isPinguDev(author))
                return returnValue.setMessage(`Who do you think you are exactly?`);
            else if (command.mustBeBeta && client.isLive)
                return returnValue.setMessage(`${client.DefaultPrefix}test should only be used on ${client.clients.get('Beta')}.`);

            //Permission check for required permissions
            if (channel.type != 'dm' && command.permissions) {
                let permCheck = client.permissions.checkFor(message, ...(command.permissions.includes('SEND_MESSAGES') ? command.permissions : [...command.permissions, 'SEND_MESSAGES']));
                if (permCheck != client.permissions.PermissionGranted)
                    return returnValue.setMessage(permCheck);
            }
            return returnValue.setValue(true);
        }
        async function ExecuteAndLogCommand() {
            let logMessage = `User **${author.username}** executed command **${command.name}**, from ${(!guild ? `DMs and ` : `"${guild}", #${channel.name}, and `)}`;

            //Attempt execution of command
            try {
                if (commandName == "tell") await HandleTell(message, args);

                const pGuild = client.pGuilds.get(guild);
                const pGuildMember = client.pGuildMembers.get(guild).get(member);
                pAuthor = !pAuthor ? await client.pUsers.add(author, module.exports.name, `${message.author.tag} did not have a PinguUser entry`) : pAuthor

                var pGuildClient = guild && pGuild ? client.toPClient(pGuild) : null
                var parameters = { client, message, args, pGuild, pAuthor, pGuildMember, pGuildClient }

                let achievementParams = { ...parameters, response: await command.execute(parameters) };
                logMessage += `**succeeded!**`;

                const achieverClasses = { user: author, guildMember: member, guild };

                client.AchievementCheck(achieverClasses, 'COMMAND', command.name, [achievementParams]).catch(err => {
                    client.log('error', `Handling COMMAND achievement check`, content, err, {
                        params: achievementParams,
                        additional: { achieverClasses }
                    })
                })
            } catch (err) {
                if (err.message == 'Missing Access' && guild.id == client.savedServers.get('Pingu Emotes').id && await FindPermission())
                    return; //Error occured, but cycled through permissions to find missing permission
                else if (err.message == 'Missing Access') return message.channel.send(`I'm missing a permission to execute ${commandName}!`);

                logMessage += `**failed!**\nError: ${err}`;

                client.log('error', `Trying to execute "${command.name}"!`, content, err, {
                    params: { message: { 
                        channelId: channel.id, 
                        id: message.id,
                        content,
                        guildId: guild?.id
                    } },
                    additional: { args, ConsoleLog: logMessage, commandName, command },
                });
            }
            console.log(" ");
            client.log('console', logMessage);

            async function FindPermission() {
                //Find Danho and make check variable, to bypass "You don't have that permission!" (gotta abuse that PinguDev power)
                const check = { 
                    author: client.developers.get('Danho'),
                    channel,
                };

                //Check if client has permission to Manage Roles in Pingu Emote Server
                const hasManageRoles = client.permissions.checkFor(check, 'MANAGE_ROLES') == client.permissions.PermissionGranted;
                if (hasManageRoles != client.permissions.PermissionGranted) return channel.send(hasManageRoles.toString());

                const roles = {
                    clientRole: guild.me.roles.cache.find(r => r.managed),
                    adminRole: guild.roles.cache.find(r => r.name == `Pingu's Admin Permission`)
                };
                const permissionInfo = {
                    discordPermissions: Object.keys(DiscordPermissions).filter(permissionString => permissionString != DiscordPermissions.ADMINISTRATOR),
                    permission: "Missing Permission",
                    originalPermissions: roles.clientRole.permissions
                };

                for (let i = 0; permissionInfo.permission != "Missing Permission" || i == permissionInfo.discordPermissions.length - 1; i++) {
                    //Find new permission and check if client already has that permission
                    const permission = permissionInfo.discordPermissions[i];
                    const hasPermission = client.permissions.checkFor(check, permission) == client.permissions.PermissionGranted;
                    if (hasPermission) continue;

                    //Give Administrator permission
                    await guild.me.roles.add(roles.adminRole);

                    //Add the new permission onto original permissions
                    const newPermissions = permissionInfo.originalPermissions.add(permission);
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
                            client.log('error', `Looked for missing permission, but ran into another error`, content, new Error(err), {
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

            return client.AchievementCheck({ user: author, guildMember: member, guild }, key, achievement.type, [content]);
        }
    }
);