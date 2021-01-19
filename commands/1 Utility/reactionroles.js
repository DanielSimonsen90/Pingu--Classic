const { Message, GuildChannel, TextChannel, GuildEmoji, Role, Collection, MessageEmbed } = require('discord.js');
const { FORMERR } = require('dns');
const { PinguLibrary, PinguGuild, PinguUser, DiscordPermissions, ReactionRole } = require('../../PinguPackage');

module.exports = {
    name: 'reactionroles',
    description: 'Gives/Removes roles for Users who reacted to a message',
    usage: '<create [channel] <message id> <emoji> <role id> | delete [channel] <message id> <emoji> <remove from users? true/false>',
    guildOnly: true,
    id: 1,
    examples: [""],
    permissions: [DiscordPermissions.SEND_MESSAGES, DiscordPermissions.ADD_REACTIONS, DiscordPermissions.MANAGE_ROLES],
    /**@param {{message: Message, args: string[], pAuthor: PinguUser, pGuild: PinguGuild}}*/
    async execute({ message, args, pAuthor, pGuild }) {
        //Get command
        let command = args.shift().toLowerCase();
        if (!command) return message.channel.send(`Sub-command not provided! Do I **create** or **delete** a reactionrole?`);

        //Ensure correct command & args[0 & 1] exists
        let permCheck = PermissionCheck(command, args);
        if (permCheck != PinguLibrary.PermissionGranted) return message.channel.send(permCheck);

        //User mentioned a channel
        let channelResult = GetChannel(message, args);
        if (channelResult.result != PinguLibrary.PermissionGranted) return message.channel.send(channelResult.result);
        args = channelResult.args;
        let { channel } = channelResult;

        //Get reaction role message
        var rrMessage = await channel.messages.fetch(args.shift());
        if (!rrMessage) return message.channel.send(`Message ID is not from ${channel}!`);

        //Get emote
        let emoteResult = GetEmote(message, args)
        if (emoteResult.result != PinguLibrary.PermissionGranted) return message.channel.send(emoteResult.result);
        args = emoteResult.args;
        let { emote } = emoteResult;

        //IF command is delete, perform delete method
        if (command == 'delete') return Delete(message, channel, rrMessage, emote, args);

        //Get role
        let roleResult = await GetRole(message, args);
        if (roleResult.result != PinguLibrary.PermissionGranted) return message.channel.send(roleResult.result);
        args = roleResult.args;
        let { role } = roleResult;

        //Set ReactionRole
        let setRRResult = await SetReactionRoles(pGuild, rrMessage, emote, role);
        if (setRRResult != PinguLibrary.PermissionGranted) return message.channel.send(`I cannot create that reactionrole, as I already have a reactionrole with that ${setRRResult}!`);

        await rrMessage.react(emote);

        return message.channel.send(new MessageEmbed()
            .setTitle(`Reaction Role Created!`)
            .setDescription(`Your reaction-role in ${channel} (${rrMessage.id}), giving ${role} for reacting with ${emote} is now ready!`)
            .setColor(pGuild.embedColor)
        )
    }
}

/**@param {string} command
 * @param {string[]} args*/
function PermissionCheck(command, args) {
    if (!['create', 'delete'].includes(command)) return `Sub-command not recognized! Do I **create** or **delete** a reactionrole?`;
    else if (!args[0]) return `Please provide a **message id**!`;
    else if (!args[1]) return `Please provide the emoji I need to remove!`;
    return PinguLibrary.PermissionGranted
}

/**@param {Message} message
 * @param {string[]} args*/
function GetChannel(message, args) {
    if (args[0] && !isNaN(args[0]) && args[1] && !isNaN(args[1]) || message.mentions.channels.first()) {
        let channelID = args.shift()
        let guildChannel = message.guild.channels.cache.find(c => c.id == channelID) || message.mentions.channels.first();
        if (!guildChannel || !guildChannel.isText()) return { result: `Please provide a channel ID of text channels!` };
        var channel = toTextChannel(guildChannel);
    }
    if (!channel) channel = message.channel;
    return { channel, args, result: PinguLibrary.PermissionGranted };

    /**@param {GuildChannel} channel
 * @returns {TextChannel}*/
    function toTextChannel(channel) {
        return channel.isText() && channel;
    }
}

/**@param {Message} message
 * @param {string[]} args*/
function GetEmote(message, args) {
    let emoteString = args.shift();

    if (emoteString.match(/<:\w{2,}:\d{18}>/g)) {
        let emoteID = emoteString.split(':')[2];
        emoteID = emoteID.substring(0, emoteID.length - 1);
        var emote = message.guild.emojis.cache.get(emoteID);
    }
    else if (emoteString.charCodeAt(0) > 255) {
        emote = emoteString;
    }
    else return { result: `${emoteString} is not an emote!` };
    if (!emote) return { result: `Emote not found!`};

    return { result: PinguLibrary.PermissionGranted, emote, args };
}

/**@param {Message} message
 * @param {string[]} args*/
async function GetRole(message, args) {
    let roleID = args.shift();
    if (isNaN(roleID) && !message.mentions.roles.first())
        return { result: `Please give me a role ID!` };
    if (isNaN(roleID)) roleID = message.mentions.roles.first().id;

    let role = message.mentions.roles.first() || await message.guild.roles.fetch(roleID);
    if (!role) return { result: `Role wasn't found!` };

    return { result: PinguLibrary.PermissionGranted, role, args };
}

/**@param {PinguGuild} pGuild
 * @param {Message} rrMessage
 * @param {GuildEmoji} emote
 * @param {Role} role*/
async function SetReactionRoles(pGuild, rrMessage, emote, role) {
    let containsCheck = PinguLibrary.PermissionGranted;
    pGuild.reactionRoles.find(rr => {
        let check = !((rr.emoteName == emote && rr.emoteName.charCodeAt(0) == emote.charCodeAt(0) ||
            rr.emoteName == emote.name) && "emote" ||
            rr.pRole.id == role.id && "role") && PinguLibrary.PermissionGranted
        if (check != PinguLibrary.PermissionGranted)
            containsCheck = check;
    });
    if (containsCheck != PinguLibrary.PermissionGranted) return containsCheck;

    pGuild.reactionRoles.push(new ReactionRole(rrMessage, emote && emote.name || emote, role));

    await PinguGuild.UpdatePGuildJSONAsync(rrMessage.client, rrMessage.guild, `ReactionRoles: SetReactionRoles`,
        `Successfully saved **${rrMessage.guild.name}**'s ReactionRole using ${emote.name} giving ${role.name}.`,
        `Failed saving **${rrMessage.guild.name}**'s ReactionRole!`
    );

    return PinguLibrary.PermissionGranted;
}

/**@param {Message} message
 * @param {TextChannel} channel
 * @param {Message} rrMessage
 * @param {string} emoteName
 * @param {string[]} args*/
async function Delete(message, channel, rrMessage, emoteName, args) {
    let removeFromUsers = args[0] && args.shift().toLowerCase() == `true`;

    let reactionRoles = PinguGuild.GetPGuild(rrMessage.guild).reactionRoles;
    let rr = reactionRoles.find(rr => rr.channel.id == channel.id && rr.messageID == rrMessage.id && rr.emoteName == emoteName);
    if (!rr) return message.channel.send(`I wasn't able to find that reactionrole in your pGuild!`);

    if (!rrMessage.reactions.cache.array().find(reaction => reaction.emoji.name == emoteName))
        return message.channel.send(`No one has reacted with ${emoteName} on that message!\n${rrMessage.url}`);

    if (removeFromUsers) {
        let role = await rrMessage.guild.roles.fetch(rr.pRole.id);

        let gMembers = rrMessage.reactions.cache.array().map(reaction =>
            reaction.emoji.name == emoteName && reaction.users.cache.array().map(u =>
                rrMessage.guild.member(u)
            )
        )[0];

        for (var gm of gMembers) {
            if (!gm.roles.cache.has(role.id)) continue;
            await gm.roles.remove(role);
        }
    }

    for (var reaction of rrMessage.reactions.cache.array()) {
        if (reaction.emoji.name == emoteName)
            await reaction.remove();
    }

    await PinguGuild.UpdatePGuildJSONAsync(message.client, message.guild, `reactionroles: Delete()`,
        `Successfully deleted **${rrMessage.guild.name}**'s ${emote.name} ReactionRole`,
        `Failed deleting **${rrMessage.guild.name}**'s ${emote.name} ReactionRole`
    );

    return message.channel.send(`Reaction role for ${emoteName} was removed.`);
}