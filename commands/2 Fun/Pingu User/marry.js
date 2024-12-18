﻿const { Message, MessageEmbed, MessageAttachment } = require('discord.js');
const { PinguCommand, PinguLibrary, PinguUser, Marry } = require('PinguPackage');

module.exports = new PinguCommand('marry', 'Fun', 'Marries a user', {
    usage: '[divorce] <@user>',
    guildOnly: true,
    examples: ["@Danho2105", "divorce"]
}, async ({ client, message, args, pAuthor, pGuildClient }) => {
    if (!pAuthor) return message.channel.send(`I can't find your PinguUser in my database!`);

    else if (args[0] && args[0].toLowerCase() == `divorce`) {
        if (pAuthor.marry.partner) return HandleDivorce(message, pAuthor);
        else return message.channel.send(`Divorce who? ${PinguLibrary.getEmote(client, 'kekw', PinguLibrary.SavedServers.get('Deadly Ninja'))}`);
    }

    else if (!message.mentions.users.first()) {
        if (pAuthor.marry.partner) return message.channel.send(new Marry(pAuthor.marry.partner, pAuthor.marry.internalDate).marriedMessage());
        return message.channel.send(pAuthor.marry.marriedMessage() + "\n\nYou can marry others by typing `" + pGuildClient.prefix + "marry <@user>`");
    }

    else if (pAuthor.marry.partner) return message.channel.send(`You're already married, you unloyal filth!`);

    let partner = message.mentions.users.first();
    let pPartner = await PinguUser.Get(partner);

    if (!pPartner) return message.channel.send(`${partner} is not a Pingu User - if they want to marry you, you should ask them to run the command!`);

    if (pPartner.marry.partner) return message.channel.send(`I'm sorry, ${message.author}, ${partner} is already married!`);

    let authorMarry = new Marry(pAuthor.marry.partner, pAuthor.marry.internalDate);
    let partnerMarry = new Marry(pPartner.marry.partner, pPartner.marry.internalDate);

    await message.channel.send(`Will you, ${partner}, take ${message.author} as your loyal partner? ` + "`Yes` or `No`");
    let partnerReply = (await message.channel.awaitMessages(m => m.author.id == partner.id, { time: 60000, max: 1 })).first();
    if (!partnerReply) return message.channel.send(`${partner} was too slow to confirm!`);
    else if (partnerReply.content.toLowerCase() != 'yes') return message.channel.send(`Wedding is called off!`);

    authorMarry.marry(partner);
    partnerMarry.marry(message.author);

    pAuthor.marry = authorMarry;
    pPartner.marry = partnerMarry;

    await UpdatePUsers(message, pAuthor, pPartner);
    return message.channel.send(new MessageEmbed()
        .setTitle(`${message.author.username} & ${partner.username} are now married!`)
        .setDescription(`Everyone give them gifts now and wish for them to have a *lovely* honeymoon 😏`)
        .attachFiles([new MessageAttachment(PinguLibrary.getImage(module.exports.name, 'nowMarried'), 'nowMarried.png')])
        .setThumbnail('attachment://nowMarried.png')
        .setTimestamp(Date.now())
        .setColor(pGuildClient.embedColor)
    );
});

/**@param {Message} message
 * @param {PinguUser} pAuthor*/
async function HandleDivorce(message, pAuthor) {
    message.channel.send(`Are you sure you want to divorce <@${pAuthor.marry.partner._id}>? ` + "`Yes` or `No`");
    let response = (await message.channel.awaitMessages(m => m.author.id == message.author.id, { max: 1 })).first().content.toLowerCase();

    if (response != 'yes')
        return message.channel.send(`Alright then.`);

    let partner = message.client.users.cache.find(u => u.id == pAuthor.marry.partner._id);
    let pPartner = await PinguUser.Get(partner);

    let authorMarry = new Marry(pAuthor.marry.partner, pAuthor.marry.internalDate);
    let partnerMarry = new Marry(pPartner.marry.partner, pPartner.marry.internalDate);

    authorMarry.divorce();
    partnerMarry.divorce();

    pAuthor.marry = authorMarry;
    pPartner.marry = partnerMarry;

    UpdatePUsers(message, pAuthor, pPartner);

    return message.channel.send(`Congratulations. You're now a free being! ${PinguLibrary.getEmote(message.client, 'hypers', PinguLibrary.SavedServers.get('Pingu Support'))}`);
}

/**@param {Message} message
 * @param {PinguUser} pAuthor
 * @param {PinguUser} pPartner*/
async function UpdatePUsers(message, pAuthor, pPartner) {
    return Promise.all([
        PinguUser.Update(message.client, ['marry'], pAuthor, module.exports.name, `**${pAuthor.tag}**'s marry property was modified`),
        PinguUser.Update(message.client, ['marry'], pPartner, module.exports.name, `**${pPartner.tag}**'s marry property was modified`)
    ]);
}