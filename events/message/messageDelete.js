const { MessageEmbed } = require("discord.js");
const { PinguGuild, PinguEvent } = require("PinguPackage");

module.exports = new PinguEvent('messageDelete',
    async function setContent(message) {
        return module.exports.content = new MessageEmbed().setDescription(`> ${message.content}\n- ${message.author}\n\n...was deleted from ${message.channel}.`);
    },
    async function execute(client, message) {
        (async function IsReactionRole() {
            let { guild } = message;
            if (!guild) return;

            let pGuild = await PinguGuild.GetPGuild(guild);
            if (!pGuild) return;

            let pGuildClient = client.toPClient(pGuild);

            let { reactionRoles } = pGuild.settings;
            let rrFromMessage = reactionRoles.map(rr => rr.messageID == message.id && rr.pRole && rr).filter(v => v);

            if (!rrFromMessage) return;

            let rrEmotes = rrFromMessage.map(rr => rr.emoteName);

            let warningMessageInfoPromise = rrFromMessage.map(rr => `${guild.emojis.cache.find(e => e.name == rr.emoteName)}: ${guild.roles.cache.find(r => r.id == rr.pRole._id)}`);
            if (!warningMessageInfoPromise[0]) return;

            for (var reaction of message.reactions.cache.array()) {
                if (!rrEmotes.includes(reaction.emoji.name)) continue;

                let gMembers = reaction.users.cache.array().map(u => guild.member(u));
                let rr = reactionRoles.find(rr => rr.emoteName == reaction.emoji.name);
                let role = await guild.roles.fetch(rr.pRole._id);

                for (var gm of gMembers) await gm.roles.remove(role, `ReactionRole message deleted`);
            }

            message.author.send(new MessageEmbed()
                .setTitle(`ReactionRole message deleted!`)
                .setColor(pGuildClient.embedColor)
                .setTimestamp(Date.now())
                .setDescription(
                    `**Your reactionrole message in ${message.channel} was deleted!**\n` +
                    `It had these reactionroles assigned to it:\n` +
                    warningMessageInfoPromise.join(`\n`)
                )
            )
        })();
    },
);