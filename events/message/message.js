const { Guild, MessageEmbed } = require("discord.js");
const { PinguGuild, PinguLibrary, PinguUser, DiscordPermissions, Error, PClient, CommandCategories, PinguEvent, PinguGuildMember } = require("PinguPackage");
const { HandleTell, ExecuteTellReply } = require('../../commands/2 Fun/Pingu User/tell');
const { CheckRoleChange } = require("../guild/role/roleUpdate");

module.exports = new PinguEvent('message',
    async function setContent(message) {
        try {
            return module.exports.content = new MessageEmbed()
                .setDescription(message.content ? `"${message.content}"` : "")
                .addField(`ID`, message.id, true)
                .addField(`URL`, message.url, true)
                .addField(`Channel`, message.channel, true)
                .addField(`Type`, message.type, true)
                .addField(`Guild`, message.guild && message.guild.name || "DMs", true)
                .addField(`Attachments?`, message.attachments.first() != null, true)
                .addField(`Embeds?`, message.embeds[0] != null, true)
                .addField(`TTS?`, message.tts, true)
                .addField(`Mentions?`, GetMentions(), true)
        } catch (err) {
            console.log();
        }

        function GetMentions() {
            let result = [];
            if (message.mentions.channels.first()) result.push(`${message.mentions.channels.size} channel${(message.mentions.channels.size > 1 ? 's' : '')}`);
            if (message.mentions.roles.first()) result.push(`${message.mentions.roles.size} roles${(message.mentions.roles.size > 1 ? 's' : '')}`);
            if (message.mentions.users.first()) result.push(`${message.mentions.users.size} users${(message.mentions.users.size > 1 ? 's' : '')}`);
            if (message.mentions.everyone) result.push(`\`@everyone\``);

            return result.length > 0 ? `Mentioned ` + result.join(`, `) : `No mentions`;
        }
    },
    async function execute(client, message) {
        //Log latency
        PinguLibrary.latencyCheck(message).catch(err => PinguLibrary.errorLog(client, `LatencyCheck error`, message.content, err, {
            params: client, message
        }));

        //User sent a message in #emotes, and is expecitng an emote to be made
        if (await fromEmotesChannel()) return;

        //Assign prefix
        let prefix = message.guild ? await HandlePGuild(message.guild) : client.DefaultPrefix;

        //Split prefix from message content
        let args = message.content.slice(prefix.length).split(/ +/);

        //Get commandName
        let commandName = args.shift();

        //If mentioned without prefix
        if (message.content && message.content.includes(client.user.id) && !args.length && !message.author.bot)
            return message.channel.send(`My prefix is \`${prefix}\``);

        //If interacted via @
        commandName = TestTagInteraction();

        var startsWithPrefix = message.content.startsWith(prefix) && !message.author.bot || message.content && message.content.includes(client.id);

        //If I'm not interacted with don't do anything
        if (message.channel.type == 'dm' && (message.author.bot || (await PinguUser.GetPUser(message.author)).replyPerson) && (!startsWithPrefix || commandName && commandName.includes(prefix)))
            return ExecuteTellReply(message).catch(err => PinguLibrary.errorLog(client, `Failed to execute tell reply`, message.content, err, {
                params: { client, message },
                additional: { prefix, args, commandName, startsWithPrefix }
            }));

        if (!startsWithPrefix) return;

        //Attempt "command" assignment
        let command = AssignCommand();
        if (!command) return;

        //Decode command
        let decoded = DecodeCommand();
        if (!decoded.value) return decoded.type == 'text' ? message.channel.send(decoded.message) : message.author.send(decoded.message);

        //Execute command and log it
        ExecuteAndLogCommand();

        async function fromEmotesChannel() {
            if (!message.guild || message.author.bot || !message.channel.name.includes('emote') || !message.channel.name.includes('emoji')) return false;

            let permCheck = PinguLibrary.PermissionCheck(message, 'MANAGE_EMOJIS', 'SEND_MESSAGES')
            if (permCheck != PinguLibrary.PermissionGranted) {
                message.channel.send(permCheck);
                return false;
            }

            if (!client.isLive && message.guild.members.cache.has(PinguClient.Clients.PinguID)) return false;

            for (var file of message.attachments.array()) {
                let errMsg = "";

                let emote = file && file.attachment;
                let name = message.content && message.content.replace(' ', '_') || file && file.name.split('.')[0];

                if (!file) errMsg = "No file attatched!";
                else if (!emote) errMsg = "No suitable emote attachment!";
                else if (!name) errMsg = "No name provided!";

                if (errMsg) {
                    message.channel.send(errMsg);
                    return false;
                }
                var newEmote = await message.guild.emojis.create(emote, name).catch(err => {
                    message.channel.send(err.message);
                    return null;
                });
                if (!newEmote) continue;

                message.channel.send(`${newEmote} was created!`);
                PinguLibrary.consoleLog(client, `Created :${newEmote.name}: for ${message.guild.name}`);
            }
            return true;
        }
        /**@param {Guild} guild
         * @returns {Promise<string>} */
        async function HandlePGuild(guild) {
            //Get PinguGuild from MongolDB
            let pGuild = await PinguGuild.GetPGuild(guild);

            //If pGuild wasn't found, create pGuild
            if (!pGuild) {
                PinguLibrary.pGuildLog(client, module.exports.name, `Unable to find pGuild for **${guild.name}**! Creating one now...`)
                await PinguGuild.WritePGuild(client, message.guild, module.exports.name,
                    `Successfully created PinguGuild for **${message.guild.name}**`,
                    `Failed creating PinguGuild for **${message.guild.name}**`
                );
                return client.DefaultPrefix;
            }
            else if (pGuild.name != guild.name) client.emit('guildUpdate', { name: pGuild.name, client, id: pGuild._id }, guild);

            let pGuildClient = client.toPClient(pGuild);
            let clientIndex = client.isLive ? 0 : 1;

            if (!pGuildClient) {
                pGuildClient = pGuild.clients[clientIndex] = new PClient(client, guild);
                await PinguGuild.UpdatePGuild(client, { clients: pGuild.clients }, pGuild, module.exports.name,
                    `Added ${client.user.tag} to ${pGuild.name}'s PinguGuild`,
                    `Failed to add ${client.user.tag} to ${pGuild.name}'s PinguGuild`,
                );
            }

            if (pGuildClient.embedColor != guild.me.roles.cache.find(botRoles => botRoles.managed).color)
                CheckRoleChange(guild, pGuild, module.exports.name);
            return pGuildClient.prefix || client.DefaultPrefix
        }
        function TestTagInteraction() {
            if (commandName.includes(client.user.id))
                commandName = args.shift();
            return commandName;
        }
        function AssignCommand() {
            let command = client.commands.get(commandName);
            if (command) return command;

            let commands = client.commands.array();
            command = commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName))
            if (command) return command;

            //If command assignment failed, assign command
            commandName = args[0] && args[0].toLowerCase();
            if (!commandName) return null;

            command = client.commands.get(commandName) || commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

            //Music alias was used
            if (command.name == 'music') {
                args.unshift(commandName);
                commandName = command.name;
            }

            return command;
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
            if (command.guildOnly && !message.guild)
                return returnValue.setMessage(`That command can only be executed in servers!`);

            //If GuildSpecific
            if (command.category == CommandCategories.GuildSpecific) {
                if (!message.guild) return returnValue.setMessage(`That command can only be used in a specific server!`);
                if (command.specificGuildID != message.guild.id)
                    return returnValue.setMessage(`That command cannot be used in this server!`);
            }

            //If DevOnly
            if (command.category == CommandCategories.DevOnly && !PinguLibrary.isPinguDev(message.author))
                return returnValue.setMessage(`Who do you think you are exactly?`);

            if (message.channel.type != 'dm' && command.permissions) {
                let permCheck = PinguLibrary.PermissionCheck(message, ...(command.permissions.includes('SEND_MESSAGES') ? command.permissions : [...command.permissions, 'SEND_MESSAGES']));
                if (permCheck != PinguLibrary.PermissionGranted)
                    return returnValue.setMessage(permCheck);
            }
            return returnValue.setValue(true);
        }
        async function ExecuteAndLogCommand() {
            let ConsoleLog = `User **${message.author.username}** executed command **${commandName}**, from ${(!message.guild ? `DMs` : `"${message.guild}", #${message.channel.name},`)} and `;

            //Attempt execution of command
            try {
                if (commandName == "tell") await HandleTell(message, args);

                var pGuild = message.guild ? await PinguGuild.GetPGuild(message.guild) : null;
                var pAuthor = await PinguUser.GetPUser(message.author);

                if (!pAuthor) {
                    await PinguUser.WritePUser(client, message.author, module.exports.name,
                        `Successfully added ${message.author.tag} to PinguUsers`,
                        `Failed to add ${message.author.tag} to PinguUsers`
                    );
                    pAuthor = await PinguUser.GetPUser(message.author);
                }

                var pGuildMember = await PinguGuildMember.GetPGuildMember(message.member);
                var pGuildClient = message.guild && pGuild ? client.toPClient(pGuild) : null
                var parameters = { client, message, args, pGuild, pAuthor, pGuildMember, pGuildClient }

                let achievementParams = { ...parameters, response: await command.execute(parameters) };
                ConsoleLog += `**succeeded!**`;

                const achieverClasses = {
                    user: message.author,
                    guildMember: message.member,
                    guild: message.guild
                };

                await PinguLibrary.AchievementCheck(client, achieverClasses, 'COMMAND', command.name).catch(err => {
                    PinguLibrary.errorLog(client, `Handling COMMAND achievement check`, message.content, err, {
                        params: achievementParams,
                        additional: { achieverClasses }
                    })
                })
            } catch (err) {
                if (err.message == 'Missing Access' && message.guild.id == PinguLibrary.SavedServers.PinguEmotes(client).id && await FindPermission())
                    return; //Error occured, but cycled through permissions to find missing permission

                ConsoleLog += `**failed!**\nError: ${err}`;

                

                PinguLibrary.errorLog(client, `Trying to execute "${command.name}"!`, message.content, err, {
                    params: { client, message },
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
                    channel: message.channel,
                    client,
                    content: message.content
                };

                //Check if client has permission to Manage Roles in Pingu Emote Server
                let hasManageRoles = PinguLibrary.PermissionCheck(check, 'MANAGE_ROLES') == PinguLibrary.PermissionGranted;
                if (hasManageRoles != PinguLibrary.PermissionGranted) return message.channel.send(hasManageRoles);

                let roles = {
                    clientRole: message.guild.me.roles.cache.find(r => r.managed),
                    adminRole: message.guild.roles.cache.find(r => r.name == `Pingu's Admin Permission`)
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
                    await message.guild.me.roles.add(roles.adminRole);

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
                            PinguLibrary.errorLog(client, `Looked for missing permission, but ran into another error`, message.content, new Error(err), {
                                params: { client, message },
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
                    return message.channel.send(`Attempted to find missing permission to execute ${command.name}, but ran out of permissions to check! Am I mising more than 1 permission?`);
                }

                return message.channel.send(`I'm missing the **${permissionInfo.permission}** permission to execute **${command.name}**!`);
            }
        }
    }
);