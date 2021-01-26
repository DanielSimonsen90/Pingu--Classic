const { Client, Invite, MessageEmbed } = require("discord.js");

module.exports = {
    name: 'events: inviteCreate',
    /**@param {{invite: Invite}}*/
    setContent({ invite }) {
        return module.exports.content = new MessageEmbed()
            .addField(`Code`, invite.code, true)
            .addField(`Expiration`, invite.expiresAt, true)
            .addField(`Invite Channel`, invite.channel, true)
            .addField(`Max Uses`, invite.maxUses, true)
            .addField(`Temporary?`, invite.temporary, true)
            .addField(`Inviter`, invite.inviter, true)
            .setURL(invite.url);
    },
    /**@param {Client} client
     @param {{invite: Invite}}*/
    execute(client, { invite }) {

    }
}