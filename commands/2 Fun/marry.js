const { Message, MessageEmbed, MessageAttachment } = require('discord.js');
const { PinguLibrary, PinguGuild, PinguUser, DiscordPermissions, Marry } = require('../../PinguPackage');

module.exports = {
    name: 'marry',
    description: 'Marries a user',
    usage: '[divorce] <@user>',
    guildOnly: true,
    id: 2,
    examples: ["@Danho2105", "divorce"],
    permissions: [DiscordPermissions.SEND_MESSAGES],
    /**@param {{message: Message, args: string[], pAuthor: PinguUser, pGuild: PinguGuild}}*/
    async execute({ message, args, pAuthor, pGuild }) {
        if (!pAuthor) return message.channel.send(`I can't find your PinguUser in my database!`);
        else if (args[0] && args[0].toLowerCase() == `divorce`) {
            if (pAuthor.marry.partner) return HandleDivorce(message, pAuthor);
            else return message.channel.send(`Divorce who? ${PinguLibrary.getEmote(message.client, 'kekw', PinguLibrary.SavedServers.DeadlyNinja(message.client))}`);
        }
        else if (!message.mentions.users.first()) {
            if (pAuthor.marry.partner) return message.channel.send(new Marry(pAuthor.marry.partner, pAuthor.marry.internalDate).marriedMessage);
            return message.channel.send(pAuthor.marry.marriedMessage + "\n\nYou can marry others by typing `" + pGuild.botPrefix + "marry <@user>`");
        }
        else if (pAuthor.marry.partner) return message.channel.send(`You're already married, you unloyal filth!`);
        let partner = message.mentions.users.first();
        let pPartner = PinguUser.GetPUser(partner);

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

        message.channel.send(new MessageEmbed()
            .setTitle(`${message.author.username} & ${partner.username} are now married!`)
            .setDescription(`Everyone give them gifts now and wish for them to have a *lovely* honeymoon 😏`)
            .attachFiles([new MessageAttachment(PinguLibrary.getImage(this.name, 'nowMarried'), 'nowMarried.png')])
            .setThumbnail('attachment://nowMarried.png')
            .setTimestamp(Date.now())
            .setColor(pGuild.embedColor)
        )

        UpdatePUsers();
    }
}

/**@param {Message} message
 * @param {PinguUser} pAuthor*/
async function HandleDivorce(message, pAuthor) {
    message.channel.send(`Are you sure you want to divorce <@${pAuthor.marry.partner.id}>? ` + "`Yes` or `No`");
    let response = (await message.channel.awaitMessages(m => m.author.id == message.author.id, { max: 1 })).first().content.toLowerCase();

    if (response == 'yes') {
        let partner = message.client.users.cache.find(u => u.id == pAuthor.marry.partner.id);
        let pPartner = PinguUser.GetPUser(partner);

        let authorMarry = new Marry(pAuthor.marry.partner, pAuthor.marry.internalDate);
        let partnerMarry = new Marry(pPartner.marry.partner, pPartner.marry.internalDate);

        authorMarry.divorce();
        partnerMarry.divorce();

        pAuthor.marry = authorMarry;
        pPartner.marry = partnerMarry;

        UpdatePUsers();

        return message.channel.send(`Congratulations. You're now a free being! ${PinguLibrary.getEmote(message.client, 'hypers', PinguLibrary.SavedServers.PinguSupport(message.client))}`);
    }
    else return message.channel.send(`Alright then.`);
}

function UpdatePUsers() {
    PinguUser.UpdatePUsersJSON(message.client, message.author, this.name,
        `Successfully updated **${message.author.tag}.json**'s marry property`,
        `Failed updating **${message.author.tag}.json**'s marry property!`
    );

    PinguUser.UpdatePUsersJSON(message.client, partner, this.name,
        `Successfully updated **${partner.tag}.json**'s marry property`,
        `Failed updating **${partner.tag}.json**'s marry property!`
    );
}