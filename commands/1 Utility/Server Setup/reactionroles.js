const { Message, GuildChannel, TextChannel, GuildEmoji, Role, MessageEmbed } = require('discord.js');
const { PinguCommand, PinguLibrary, PinguGuild, ReactionRole } = require('PinguPackage');

module.exports = new PinguCommand('reactionroles', 'Utility', 'Gives/Removes roles for users who reacted to a message', {
    usage: '<create [channel] <message id> <emoji> <role id> | delete [channel] <message id> <emoji> [remove from users? true/false]',
    guildOnly: true,
    examples: ["*reactionroles create #role-select 801055604222984223 :movie_camera: @Content Creators"],
    permissions: ['ADD_REACTIONS', 'MANAGE_ROLES'],
    aliases: ["reactionrole", "rr"]
}, async ({ message, args, pGuild, pGuildClient }) => {
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
        .setTitle(`ReactionRole Created!`)
        .setURL(rrMessage.url)
        .setDescription(`Your reactionrole in ${channel} (${rrMessage.id}), giving ${role} for reacting with ${emote} is now ready!`)
        .setColor(pGuildClient.embedColor)
    )
})


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

    if (emoteString.match(/<:\w{2,}:\d{18}>/g)) { //stirng has <: + 2 characters or more + : + 18 digits + > | <:EmojiExample:123456789012345678>
        let emoteID = emoteString.split(':')[2];
        emoteID = emoteID.substring(0, emoteID.length - 1);
        var emote = message.guild.emojis.cache.get(emoteID);
    }
    else if (emoteString.charCodeAt(0) > 255) {
        emote = emoteString;
    }
    else return { result: `${emoteString} is not an emote!` };
    if (!emote) return { result: `Emote not found!` };

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
    let { reactionRoles } = pGuild.settings;

    reactionRoles.find(rr => {
        let check = !((rr.emoteName == emote && rr.emoteName.charCodeAt(0) == emote.charCodeAt(0) ||
            rr.emoteName == emote.name) && "emote" ||
            rr.pRole._id == role.id && "role") && PinguLibrary.PermissionGranted
        if (check != PinguLibrary.PermissionGranted)
            containsCheck = check;
    });
    if (containsCheck != PinguLibrary.PermissionGranted) return containsCheck;

    reactionRoles.push(new ReactionRole(rrMessage, emote && emote.name || emote, role));

    await PinguGuild.Update(rrMessage.client, ['settings'], pGuild, `ReactionRoles: SetReactionRoles`, `Added ReactionRole to **${rrMessage.guild.name}**'s PinguGuild using ${(emote.name || emote)} giving ${role.name}.`);

    return PinguLibrary.PermissionGranted;
}

/**@param {Message} message
 * @param {TextChannel} channel
 * @param {Message} rrMessage
 * @param {string | GuildEmoji} emote
 * @param {string[]} args*/
async function Delete(message, channel, rrMessage, emote, args) {
    let removeFromUsers = args[0] && args.shift().toLowerCase() == `true`;

    let pGuild = await PinguGuild.Get(rrMessage.guild);
    let { reactionRoles } = pGuild.settings;
    let rr = reactionRoles.find(rr => rr.channel._id == channel.id && rr.messageID == rrMessage.id && (rr.emoteName == emote.name || rr.emoteName == emote));
    if (!rr) return message.channel.send(`I wasn't able to find that reactionrole in your pGuild!`);

    if (!rrMessage.reactions.cache.array().find(reaction => reaction.emoji.name == rr.emoteName))
        return message.channel.send(`No one has reacted with ${emote} on that message!\n${rrMessage.url}`);

    if (removeFromUsers) {
        let role = await rrMessage.guild.roles.fetch(rr.pRole._id);

        let gMembers = rrMessage.reactions.cache.map(reaction =>
            reaction.emoji.name == rr.emoteName && reaction.users.cache.array().map(u =>
                rrMessage.guild.member(u)
            )
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

    await PinguGuild.Update(message.client, ['settings'], pGuild, `reactionroles: Delete()`, `Deleted **${rrMessage.guild.name}**'s ${rr.emoteName} ReactionRole`);
    return message.channel.send(`Reaction role for ${emote} was removed.`);
}