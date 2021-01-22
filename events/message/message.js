const { Command, Client, Guild, Message, MessageEmbed } = require("discord.js");
const { PinguGuild, PinguLibrary, PinguUser, DiscordPermissions, Error } = require("../../PinguPackage");
const { musicCommands } = require('../../commands/2 Fun/music'), { HandleTell, ExecuteTellReply } = require('../../commands/2 Fun/tell');
const { CheckRoleChange } = require("../guild/role/roleUpdate");
const { Prefix } = require('../../config'), SecondaryPrefix = '562176550674366464';
let updatingPGuild = false;

module.exports = {
    name: 'events: message',
    /**@param {{message: Message}}*/
    setContent({ message }) {
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

        function GetMentions() {
            let result = [];
            if (message.mentions.channels.first()) result.push(`${message.mentions.channels.size} channel${(message.mentions.channels.size > 1 ? 's' : '')}`);
            if (message.mentions.members && message.mentions.members.first()) result.push(`${message.mentions.members.size} members${(message.mentions.members.size > 1 ? 's' : '')}`);
            if (message.mentions.roles.first()) result.push(`${message.mentions.roles.size} roles${(message.mentions.roles.size > 1 ? 's' : '')}`);
            if (message.mentions.users.first()) result.push(`${message.mentions.users.size} users${(message.mentions.users.size > 1 ? 's' : '')}`);
            if (message.mentions.everyone) result.push(`\`@everyone\``);

            if (result.length > 0) {
                let resultString = `Mentioned ` + result.join(`, `);
                return resultString.substring(0, result.length - 2);
            }
            return `No mentions`;
        }
    },
    /**@param {Client} client
     * @param {{message: Message}}*/
    async execute(client, { message }) {
        //Log latency
        try { PinguLibrary.LatencyCheck(message); }
        catch (err) { PinguLibrary.errorLog(client, `LatencyCheck error`, message.content, err); }

        if (await fromEmotesChannel(message)) return;

        //Assign prefix
        let prefix = message.guild ? HandlePGuild(message.guild) : Prefix;

        //Split prefix from message content
        let args = message.content.slice(prefix.length).split(/ +/) ||
            message.content.slice(SecondaryPrefix).split(/ +/);

        //Get commandName
        let commandName = args.shift();

        //If mentioned without prefix
        if (message.content.includes(SecondaryPrefix) && args.length == 0 && !message.author.bot)
            return message.channel.send(`My prefix is \`${prefix}\``);

        //If interacted via @
        commandName = TestTagInteraction(commandName, args);

        var startsWithPrefix = () => message.content.startsWith(prefix) && !message.author.bot || message.content.includes(SecondaryPrefix);

        //If I'm not interacted with don't do anything
        if (message.channel.type == 'dm' && (message.author.bot || PinguUser.GetPUser(message.author).replyPerson) && (!startsWithPrefix() || commandName.includes(prefix))) {
            try { return ExecuteTellReply(message); }
            catch (err) { return PinguLibrary.errorLog(client, `Failed to execute tell reply`, message.content, err); }
        }

        if (!startsWithPrefix()) return;

        //Attempt "command" assignment
        if (musicCommands.find(cmd => [cmd.name, cmd.alias].includes(commandName))) {
            args.unshift(commandName);
            commandName = `music`;
        } //music command was used without *music
        let command = AssignCommand(commandName, args);
        if (!command) return;

        //If I'm not interacted with don't do anything
        if ((!message.content.startsWith(prefix) || message.author.bot) && !message.content.includes(SecondaryPrefix)) return;

        //Decode command
        let decoded = DecodeCommand(message, command);
        if (!decoded.value) return decoded.type == 'text' ? message.channel.send(decoded.message) : message.author.send(decoded.message);

        //Execute command and log it
        ExecuteAndLogCommand(message, args, commandName, command);

        /**@param {Message} message*/
        async function fromEmotesChannel(message) {
            if (!message.guild || message.author.bot || message.channel.name != 'emotes') return false;

            let permCheck = PinguLibrary.PermissionCheck(message, [DiscordPermissions.MANAGE_EMOJIS, DiscordPermissions.SEND_MESSAGES])
            if (permCheck != PinguLibrary.PermissionGranted) {
                message.channel.send(permCheck);
                return false;
            }

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
                    return message.channel.send(err.message);
                });
                message.channel.send(`${newEmote} was created!`);
                PinguLibrary.consoleLog(client, `Created :${newEmote.name}: for ${message.guild.name}`);
            }
            return true;
        }
        /**@param {Guild} guild
         * @returns {string} */
        function HandlePGuild(guild) {
            //Find pGuild in servers folder
            if (updatingPGuild) updatingPGuild = false;

            let pGuild = PinguGuild.GetPGuild(guild);

            //If pGuild wasn't found, create pGuild
            if (!pGuild) {
                if (updatingPGuild) return;
                updatingPGuild = true;
                PinguLibrary.pGuildLog(client, this.name, `Unable to find pGuild for **${guild.name}**! Creating one now...`)
                PinguGuild.WritePGuild(message.guild, PinguLibrary.pGuildLog(client, this.name, `Created pGuild for **${guild.name}**`));
                return Prefix;
            }
            else if (pGuild.name != guild.name) {
                client.emit('guildUpdate', {
                    name: pGuild.name,
                    client: client,
                    id: pGuild.id
                }, guild);
            }

            if (pGuild.embedColor != guild.me.roles.cache.find(botRoles => botRoles.managed).color)
                CheckRoleChange(guild, pGuild);
            return pGuild.botPrefix || Prefix;
        }
        /**@param {string} commandName 
         * @param {string[]} args*/
        function TestTagInteraction(commandName, args) {
            if (commandName.includes(SecondaryPrefix))
                commandName = args.shift();
            return commandName;
        }
        /**@param {string} commandName 
         * @param {string[]} args
         * @returns {Command}}*/
        function AssignCommand(commandName, args) {
            let command = client.commands.get(commandName);

            //If command assignment failed, assign command
            if (!command) {
                try {
                    for (var number = 1; number < args.length || command; number++) {
                        number += 1;
                        commandName = args[number].toLowerCase();
                        command = client.commands.get(commandName);
                    }
                } catch { return; }
            }
            return command;
        }
        /**@param {Message} message
         * @param {Command} command
         * @returns {{value: boolean, message: string, type: "text" | "dm"}}*/
        function DecodeCommand(message, command) {

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
            if (command.guildOnly && message.channel.type == 'dm')
                return returnValue.setMessage(`I can't execute that command inside DMs!`)

            //If DevOnly
            if (command.id == 4 && !PinguLibrary.isPinguDev(message.author))
                return returnValue.setMessage(`Who do you think you are exactly?`);

            if (command.permissions) {
                command.permissions.push(DiscordPermissions.SEND_MESSAGES);
                let permCheck = PinguLibrary.PermissionCheck(message, command.permissions);
                if (permCheck != PinguLibrary.PermissionGranted)
                    return returnValue.setMessage(permCheck);
            }
            return returnValue.setValue(true);
        }
        /**@param {Message} message 
         * @param {string[]} args 
         * @param {string} Prefix 
         * @param {string} commandName 
         * @param {Command} command*/
        function ExecuteAndLogCommand(message, args, commandName, command) {
            let ConsoleLog = `User **${message.author.username}** executed command **${commandName}**, from ${(!message.guild ? `DMs and ` : `"${message.guild}", #${message.channel.name}, and `)}`;

            //Attempt execution of command
            try {
                if (commandName == "tell") HandleTell(message, args);

                command.execute({
                    message,
                    args,
                    pAuthor: PinguUser.GetPUser(message.author),
                    pGuild: message.guild ? PinguGuild.GetPGuild(message.guild) : null,
                });
                ConsoleLog += `**succeeded!**\n`;
            } catch (err) {
                if (err.message == 'Missing Access' && message.guild.id == PinguLibrary.SavedServers.PinguEmotes(client).id && FindPermission())
                    return; //Error occured, but cycled through permissions to find missing permission

                ConsoleLog += `**failed!**\nError: ${err}`;
                PinguLibrary.errorLog(client, `Trying to execute "${command.name}"!`, message.content, err);
            }
            PinguLibrary.consoleLog(client, ConsoleLog);
            async function FindPermission() {
                //Find Danho and make check variable, to bypass "You don't have that permission!" (gotta abuse that PinguDev power)
                let Danho = PinguLibrary.SavedServers.DanhoMisc(client).owner.user;
                let check = {
                    author: Danho,
                    channel: message.channel,
                    client: client,
                    content: message.content
                };

                //Check if client has permission to Manage Roles in Pingu Emote Server
                let hasManageRoles = PinguLibrary.PermissionCheck(check, [DiscordPermissions.MANAGE_ROLES]) == PinguLibrary.PermissionGranted;
                if (hasManageRoles != PinguLibrary.PermissionGranted) return message.channel.send(hasManageRoles);

                let roles = {
                    clientRole: message.guild.roles.cache.find(r => r.name == 'Pingu'),
                    adminRole: message.guild.roles.cache.find(r => r.name == `Pingu's Admin Permission`)
                };
                let permissionInfo = {
                    discordPermissions: Object.keys(DiscordPermissions).filter(permissionString => permissionString != DiscordPermissions.ADMINISTRATOR),
                    permission: "Missing Permission",
                    originalPermissions: roles.clientRole.permissions
                };

                for (let i = 0; !permissionInfo.permission != "Missing Permission" || i == permissionInfo.discordPermissions.length - 1; i++) {
                    //Find new permission and check if client already has that permission
                    let permission = permissionInfo.discordPermissions[i];
                    let hasPermission = PinguLibrary.PermissionCheck(check, [permission]) == PinguLibrary.PermissionGranted;
                    if (hasPermission) continue;

                    //Give Administrator permission
                    await message.guild.member(client.user).roles.add(roles.adminRole);

                    //Add the new permission onto original permissions
                    let newPermissions = permissionInfo.originalPermissions.add(permission);
                    await roles.clientRole.setPermissions(newPermissions);

                    //Execute command again
                    try {
                        command.execute(message, args);

                        //Command was executed with no error, so we have our missing permission
                        permissionInfo.permission = permission;
                    }
                    catch (err) {
                        //Another error occured, but we found the missing permission
                        if (err.message != 'Missing Access') {
                            PinguLibrary.errorLog(client, `Looked for missing permission, but ran into another error`, message.content, new Error(err));
                            permissionInfo.permission = permission;
                        }
                    }
                    //Reset permissions to original permisssions
                    finally { roles.clientRole.setPermissions(permissionInfo.originalPermissions); }
                }

                //If we cycled through all permissions with no luck
                if (permissionInfo.permission == "Missing Permission") {
                    message.channel.send(`Attempted to find missing permission to execute ${command.name}, but ran out of permissions to check! Am I mising more than 1 permission?`);
                    return PinguLibrary.errorLog(client, `Trying to execute "${command.name}"!`, message.content, err);
                }

                return message.channel.send(`I'm missing the **${permissionInfo.permission}** permission to execute **${command.name}**!`);
            }
        }
    }
}