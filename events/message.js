const { Command, Client, Guild, Message, MessageEmbed, User } = require("discord.js");
const { PinguGuild, PinguLibrary, PinguUser, DiscordPermissions, Error, PUser } = require("../PinguPackage");
const { musicCommands } = require('../commands/2 Fun/music'), { GetMention } = require('../commands/2 Fun/tell');
const { Prefix } = require('../config'), SecondaryPrefix = '562176550674366464';
let updatingPGuild = false;

module.exports = {
    name: 'events: message',
    /**@param {Client} client
     * @param {{message: Message}}*/
    async execute(client, { message }) {
        //Log latency
        try { PinguLibrary.LatencyCheck(message); }
        catch (err) { PinguLibrary.errorLog(client, `LatencyCheck error`, message.content, err); }

        if (await fromEmojiServer(message)) return;

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
        if (message.channel.type == 'dm' && (message.author.bot || PinguUser.GetPUser(message.author).replyPerson) && !startsWithPrefix()) {
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
        async function fromEmojiServer(message) {
            let guild = message.guild && message.guild.id == PinguLibrary.SavedServers.PinguEmotes(client).id && message.guild;
            if (!guild || message.author.bot || message.channel.name != 'emotes') return false;

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

                let newEmote = await guild.emojis.create(emote, name);
                message.channel.send(`${newEmote} was created!`);
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

            CheckRoleChange(guild, pGuild);
            return pGuild.botPrefix || Prefix;

            /**Checks if role color was changed, to update embed colors  
            * @param {Guild} guild
            * @param {PinguGuild} pGuild*/
            function CheckRoleChange(guild, pGuild) {
                const pGuilds = PinguGuild.GetPGuilds();

                //Get the color of the Pingu role in message.guild
                const guildRoleColor = guild.me.roles.cache.find(botRoles => botRoles.managed).color;

                //If color didn't change
                if (guildRoleColor == pGuild.embedColor) return;

                //Save Index of pGuild & log the change
                const pGuildIndex = pGuilds.indexOf(pGuild);
                PinguLibrary.ConsoleLog(`[${guild.name}]: Embedcolor updated from ${pGuild.embedColor} to ${guildRoleColor}`);

                //Update pGuild.EmbedColor with guild's Pingu role color & put pGuild back into pGuilds
                pGuild.embedColor = guildRoleColor;
                pGuilds[pGuildIndex] = pGuild;

                //Update guilds.json
                PinguGuild.UpdatePGuildJSON(client, guild, `${this.name}: CheckRoleChange`,
                    `Successfully updated role color from "${guild.name}"`,
                    `I encountered and error while updating my role color in "${guild.name}"`
                );
            }
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
            let ConsoleLog = `User "${message.author.username}" executed command "${commandName}", from ${(!message.guild ? `DMs and ` : `"${message.guild}", #${message.channel.name}, and `)}`;

            //Attempt execution of command
            try {
                if (commandName == "tell") HandleTell(message, args);

                command.execute({
                    message,
                    args,
                    pAuthor: PinguUser.GetPUser(message.author),
                    pGuild: message.guild ? PinguGuild.GetPGuild(message.guild) : null,
                });
                ConsoleLog += `succeeded!\n`;
            } catch (err) {
                if (err.message == 'Missing Access' && message.guild.id == PinguLibrary.SavedServers.PinguEmotes(client).id && FindPermission())
                    return; //Error occured, but cycled through permissions to find missing permission

                ConsoleLog += `failed!\nError: ${err}`;
                PinguLibrary.errorLog(client, `Trying to execute "${command.name}"!`, message.content, err);
            }
            PinguLibrary.ConsoleLog(ConsoleLog);
            /**@param {Message} message
             * @param {string[]} args*/
            function HandleTell(message, args) {
                if (args[0] == 'unset') {
                    let replyUser = getReplyUser(message);

                    PinguLibrary.tellLog(client, message.author, replyUser, new MessageEmbed()
                        .setTitle(`Link between **${message.author.username}** & **${replyUser.username}** was unset.`)
                        .setColor(PinguGuild.GetPGuild(PinguLibrary.SavedServers.PinguSupport(client)).embedColor)
                        .setDescription(`**${message.author}** unset the link.`)
                        .setThumbnail(message.author.avatarURL())
                        .setFooter(new Date(Date.now()).toLocaleTimeString())
                    );

                    message.author.send(`Your link to **${replyUser.username}** was unset.`);
                    return;
                }
                else if (args[0] == "info") return;
                let Mention = args[0];
                while (Mention.includes('_')) Mention = Mention.replace('_', ' ');

                let pAuthor = PinguUser.GetPUser(message.author);
                pAuthor.replyPerson = new PUser(GetMention(message, Mention));
            }
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

//#region Tell command related
/**@param {Message} message*/
async function ExecuteTellReply(message) {
    //Pingu sent message in PM
    if (message.author.id == message.client.user.id) return;

    //Get author's replyPerson
    let replyPersonPUser = PinguUser.GetPUser(message.author).replyPerson;
    if (!replyPersonPUser) return PinguLibrary.ConsoleLog(`No replyPerson found for ${message.author.username}.`);

    //Find replyPerson as Discord User
    let replyPerson = getReplyUser(message);

    //Find replyPerson as PinguUser
    let replyPersonPinguUser = PinguUser.GetPUser(replyPerson);

    //If replyPerson's replyPerson isn't author anymore, re-bind them again (replyPerson is talking to multiple people through Pingu)
    if (replyPersonPinguUser.replyPerson.id != message.author.id) {
        replyPersonPinguUser.replyPerson = new PUser(message.author);
        PinguUser.UpdatePUsersJSONAsync(message.client, replyPerson, "index: Message.ExecuteTellReply",
            `Successfully re-binded **${replyPerson.tag}**'s replyPerson to **${message.author.tag}**`,
            `Failed re-binding **${replyPerson.tag}**'s replyPerson to **${message.author.tag}**!`
        );
    }

    //Log conversation
    try { PinguLibrary.tellLog(message.client, message.author, replyPerson, message); }
    catch (err) { PinguLibrary.errorLog(message.client, 'Tell reply failed', message.content, err); }

    //Error happened while sending reply
    var cantMessage = async err => {
        if (err.message == 'Cannot send messages to this user')
            return message.channel.send(`Unable to send message to ${Mention.username}, as they have \`Allow direct messages from server members\` disabled!`);

        await PinguLibrary.errorLog(message.client, `${message.author} attempted to *tell ${Mention}`, message.content, err)
        return message.channel.send(`Attempted to message ${Mention.username} but couldn't.. I've contacted my developers.`);
    }
    //Create DM to replyPerson
    let replyPersonDM = await replyPerson.createDM();
    if (!replyPersonDM) return cantMessage({ message: "Unable to create DM from ln: 366" });

    //Add "Conversation with" header to message's content
    message.content = `**Conversation with __${message.author.username}__**\n` + message.content;

    //Send author's reply to replyPerson
    if (message.content && message.attachments.size > 0) replyPersonDM.send(message.content, message.attachments.array()).catch(async err => cantMessage(err)); //Message and files
    else if (message.content) replyPersonDM.send(message.content).catch(async err => cantMessage(err)); //Message only
    else PinguLibrary.errorLog(client, `${message.author} ➡️ ${replyPerson} used else statement from ExecuteTellReply, Index`, message.content);

    //Show author that reply has been sent
    message.react('✅');
    message.channel.send(`**Sent message to __${replyPerson.tag}__**`);
}
/**@param {Message} message*/
function getReplyUser(message) {
    let { replyPerson } = PinguUser.GetPUser(message.author);
    return getGuildUsers().find(user => user.id == replyPerson.id);

    /**@returns {User[]} */
    function getGuildUsers() {
        let guildUsersArr = message.client.guilds.cache.map(guild => guild.members.cache.map(gm => !gm.user.bot && gm.user));
        let guildUsersSorted = [];

        guildUsersArr.forEach(guildUsers => guildUsers.forEach(user => {
            if (!guildUsersSorted.includes(user))
                guildUsersSorted.push(user);
        }));
        return guildUsersSorted;
    }
}
//#endregion