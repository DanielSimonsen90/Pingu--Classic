const { Message, GuildChannel, TextChannel, GuildEmoji, Role, MessageEmbed } = require('discord.js');
const { PinguCommand, PinguClient, PinguGuild, ReactionRole, Arguments } = require('PinguPackage');

module.exports = new PinguCommand('reactionroles', 'Utility', 'Gives/Removes roles for users who reacted to a message', {
    usage: '<create [channel] <message id> <emoji> <role id> | delete [channel] <message id> <emoji> [remove from users? true/false]',
    guildOnly: true,
    examples: ["*reactionroles create #role-select 801055604222984223 :movie_camera: @Content Creators"],
    permissions: ['ADD_REACTIONS', 'MANAGE_ROLES'],
    aliases: ["reactionrole", "rr"]
}, async ({ client, message, args, pGuild, pGuildClient }) => {
    let arg = args.shift();
    const { PermissionGranted } = client.permissions;

    //Get command
    let command = arg?.toLowerCase();
    if (!command) return message.channel.send(`Sub-command not provided! Do I **create** or **delete** a reactionrole?`);

    //Ensure correct command & args[0 & 1] exists
    let permCheck = PermissionCheck(command, args);
    if (permCheck != PermissionGranted) return message.channel.send(permCheck);

    //User mentioned a channel
    let channelResult = GetChannel(message, args);
    if (channelResult.result != PermissionGranted) return message.channel.send(channelResult.result);
    args = channelResult.args;
    let { channel } = channelResult;

    //Get reaction role message
    var rrMessage = await channel.messages.fetch(args.shift());
    if (!rrMessage) return message.channel.send(`Message ID is not from ${channel}!`);

    //Get emote
    let emoteResult = GetEmote(message, args)
    if (emoteResult.result != PermissionGranted) return message.channel.send(emoteResult.result);
    args = emoteResult.args;
    let { emote } = emoteResult;

    //IF command is delete, perform delete method
    if (command == 'delete') return Delete(message, channel, rrMessage, emote, args);

    //Get role
    let roleResult = await GetRole(message, args);
    if (roleResult.result != PermissionGranted) return message.channel.send(roleResult.result);
    args = roleResult.args;
    let { role } = roleResult;

    //Set ReactionRole
    let setRRResult = await SetReactionRoles(pGuild, rrMessage, emote, role);
    if (setRRResult != PermissionGranted) return message.channel.send(`I cannot create that reactionrole, as I already have a reactionrole with that ${setRRResult}!`);

    await rrMessage.react(emote);

    return message.channel.sendEmbeds(new MessageEmbed({
        title: `ReactionRole Created!`,
        url: rrMessage.url,
        description: `Your reactionrole in ${channel} (${rrMessage.id}), giving ${role} for reacting with ${emote} is now ready!`,
        color: pGuildClient.embedColor || client.DefaultEmbedColor
    }))
})


/**@param {PinguClient} client
 * @param {string} command
 * @param {Arguments} args*/
function PermissionCheck(client, command, args) {
    if (!['create', 'delete'].includes(command)) return `Sub-command not recognized! Do I **create** or **delete** a reactionrole?`;
    else if (!args.mentions.get('SNOWFLAKE').value) return `Please provide a **message id**!`;
    else if (!args.mentions.get('EMOJI')) return `Please provide the emoji I need to remove!`;
    return client.permissions.PermissionGranted
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
    return { channel, args, result: PermissionGranted };

    /**@param {GuildChannel} channel
 * @returns {TextChannel}*/
    function toTextChannel(channel) {
        return channel.isText() && channel;
    }
}

/**@param {Message} message
 * @param {Arguments} args*/
function GetEmote(message, args) {
    const emoteMention = args.mentions.get('EMOJI');
    const emoteString = args.splice(emoteMention.index)[0];

    if (emoteMention.value) { 
        let emoteID = emoteString.split(':')[2];
        emoteID = emoteID.substring(0, emoteID.length - 1);
        var emote = message.guild.emojis.cache.get(emoteID) || emoteString;
    }
    else return { result: `${emoteString} is not an emote!` };
    if (!emote) return { result: `Emote not found!` };

    return { result: PermissionGranted, emote, args };
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

    return { result: PermissionGranted, role, args };
}

/**@param {PinguGuild} pGuild
 * @param {Message} rrMessage
 * @param {GuildEmoji} emote
 * @param {Role} role*/
async function SetReactionRoles(pGuild, rrMessage, emote, role) {
    const { client } = rrMessage;
    const { PermissionGranted } = client.permissions
    let containsCheck = PermissionGranted;
    let { reactionRoles } = pGuild.settings;

    reactionRoles.find(rr => {
        let check = !((rr.emoteName == emote && rr.emoteName.charCodeAt(0) == emote.charCodeAt(0) ||
            rr.emoteName == emote.name) && "emote" ||
            rr.pRole._id == role.id && "role") && PermissionGranted
        if (check != PermissionGranted)
            containsCheck = check;
    });
    if (containsCheck != PermissionGranted) return containsCheck;

    reactionRoles.push(new ReactionRole(rrMessage, emote?.name || emote, role));

    await client.pGuilds.update(pGuild, `ReactionRoles: SetReactionRoles`, 
        `Added ReactionRole to **${rrMessage.guild.name}**'s PinguGuild using ${(emote.name || emote)} giving ${role.name}.`
    );

    return PermissionGranted;
}

/**@param {Message} message
 * @param {TextChannel} channel
 * @param {Message} rrMessage
 * @param {string | GuildEmoji} emote
 * @param {Arguments} args*/
async function Delete(message, channel, rrMessage, emote, args) {
    let removeFromUsers = args[0] && args.shift().toLowerCase() == `true`;
    const { client } = message;
    const pGuild = client.pGuilds.get(rrMessage.guild);
    let { reactionRoles } = pGuild.settings;
    let rr = reactionRoles.find(rr => rr.channel._id == channel.id && rr.messageID == rrMessage.id && (rr.emoteName == emote.name || rr.emoteName == emote));
    if (!rr) return message.channel.send(`I wasn't able to find that reactionrole in your pGuild!`);

    if (!rrMessage.reactions.cache.find(reaction => reaction.emoji.name == rr.emoteName))
        return message.channel.send(`No one has reacted with ${emote} on that message!\n${rrMessage.url}`);

    if (removeFromUsers) {
        let role = await rrMessage.guild.roles.fetch(rr.pRole._id);

        let gMembers = rrMessage.reactions.cache.map(reaction =>
            reaction.emoji.name == rr.emoteName && reaction.users.cache.map(u => rrMessage.guild.member(u))
        )[0];

        for (var gm of gMembers) {
            if (!gm.roles.cache.has(role.id)) continue;
            await gm.roles.remove(role);
        }
    }

    for (var reaction of rrMessage.reactions.cache.array()) {
        if (reaction.emoji.name == rr.emoteName)
            await reaction.remove();
    }

    await client.pGuilds.update(pGuild, `reactionroles: Delete()`, `Deleted **${rrMessage.guild.name}**'s ${rr.emoteName} ReactionRole`);
    return message.channel.send(`Reaction role for ${emote} was removed.`);
}