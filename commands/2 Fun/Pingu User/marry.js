const { MessageEmbed, MessageAttachment } = require('discord.js');
const { PinguCommand, PinguUser, Marry } = require('PinguPackage');

module.exports = new PinguCommand('marry', 'Fun', 'Marries a user', {
    usage: '[divorce] <@user>',
    guildOnly: true,
    examples: ["@Danho2105", "divorce"]
}, async ({ client, message, args, pAuthor, pGuildClient }) => {
    if (!pAuthor) return message.channel.send(`I can't find your PinguUser in my database!`);

    const  { marry: pAuthorMarry } = pAuthor;
    const { partner: pAuthorPartner, internalDate: pAuthorInternalDate } = pAuthorMarry

    if (args[0]?.toLowerCase() == `divorce`) {
        if (pAuthorPartner) return HandleDivorce();
        else return message.channel.send(`Divorce who? ${client.emotes.get('kekw', 1)}`);
    }
    else if (!message.mentions.users.first()) {
        if (pAuthorPartner) return message.channel.send(new Marry(pAuthorPartner, pAuthorInternalDate).marriedMessage());
        return message.channel.send(pAuthorMarry.marriedMessage() + `\n\nYou can marry others by typing \`${pGuildClient.prefix}marry <@user>\`.`)
    }

    else if (pAuthorPartner) return message.channel.send(`You're already married, you unloyal filth!`);

    const partner = message.mentions.users.first();
    const pPartner = client.pUsers.get(partner);

    if (!pPartner) return message.channel.send(`${partner} is not a Pingu User - if they want to marry you, you should ask them to run the command!`);

    const { marry: pPartnerMarry } = pPartner;
    const { partner: pPartnerPartner, internalDate: pPartnerInternalDate } = pPartnerMarry

    if (pPartnerPartner) return message.channel.send(`I'm sorry, ${message.author}, ${partner} is already married!`);

    let authorMarry = new Marry(pAuthorPartner, pAuthorInternalDate);
    let partnerMarry = new Marry(pPartnerPartner, pPartnerInternalDate);

    await message.channel.send(`Will you, ${partner}, take ${message.author} as your loyal partner? ` + "`Yes` or `No`");

    let partnerReply = (await message.channel.awaitMessages(m => m.author.id == partner.id, { time: 60000, max: 1 })).first();
    if (!partnerReply) return message.channel.send(`${partner} was too slow to confirm!`);
    else if (partnerReply.content.toLowerCase() != 'yes') return message.channel.send(`Wedding is called off!`);

    authorMarry.marry(partner);
    partnerMarry.marry(message.author);

    pAuthor.marry = authorMarry;
    pPartner.marry = partnerMarry;

    await UpdatePUsers(message, pAuthor, pPartner);
    return message.channel.send(new MessageEmbed({
        title: `${message.author.username} & ${partner.username} are now married!`,
        description: `Everyone give them gifts now and wish for them to have a *lovely* honeymoon 😏`,
        timestamp: Date.now(),
        color: pGuildClient.embedColor || client.DefaultEmbedColor,
        files: [new MessageAttachment(client.getImage(module.exports.name, 'nowMarried'), 'nowMarried.png')],
    }).setThumbnail('attachment://nowMarried.png'));

    async function HandleDivorce() {
        message.channel.send(`Are you sure you want to divorce <@${pAuthor.marry.partner._id}>? ` + "`Yes` or `No`");
        let response = (await message.channel.awaitMessages(m => m.author.id == message.author.id, { max: 1, time: 60000 })).first().content.toLowerCase();
    
        if (response != 'yes') return message.channel.send(`Alright then.`);
    
        let partner = await client.users.fetch(pAuthorPartner._id);
        let pPartner = client.pUsers.get(partner);
    
        let authorMarry = new Marry(pAuthorPartner, pAuthorInternalDate);
        let partnerMarry = new Marry(pPartner.marry.partner, pPartner.marry.internalDate);
    
        authorMarry.divorce();
        partnerMarry.divorce();
    
        pAuthor.marry = authorMarry;
        pPartner.marry = partnerMarry;
    
        UpdatePUsers(message, pAuthor, pPartner);
    
        return message.channel.send(`Congratulations. You're now a free being! ${client.emotes.get('hypers', 1)}`);
    }

    /**@param {PinguUser} pAuthor @param {PinguUser} pPartner*/
    async function UpdatePUsers(pAuthor, pPartner) {
        return Promise.all([
            client.pUsers.update(pAuthor, module.exports.name, `**${pAuthor.tag}**'s marry property was modified.`),
            client.pUsers.update(pPartner, module.exports.name, `**${pPartner.tag}**'s marry property was modified.`),
        ])
    }
});
