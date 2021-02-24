const { MessageEmbed } = require("discord.js");
const { PinguLibrary, ReactionRole, PinguGuild, PinguEvent, EmbedField } = require("PinguPackage");

module.exports = new PinguEvent('messageReactionRemove',
    async function setContent(reaction, user) {
        return module.exports.content = new MessageEmbed()
            .setDescription(reaction.message.content ? `"${reaction.message.content}"` : null)
            .setURL(reaction.message.url)
            .setImage(reaction.message.attachments.first())
            .addFields([
                new EmbedField(`User`, user.tag, true),
                new EmbedField(`Reaction`, reaction.emoji, true),
                PinguLibrary.BlankEmbedField(true),
                new EmbedField(`Message ID`, reaction.message.id, true),
                new EmbedField(`Channel`, reaction.message.channel, true),
                new EmbedField(`Channel ID`, reaction.message.channel.id, true)
            ]);
    },
    async function execute(client, reaction, user) {
        if (user == client.user) return ReactionRoleClient();
        ReactionRoleUser();

        async function ReactionRoleClient() {
            let guild = reaction.message.guild;
            if (!guild) return;

            let pGuild = await PinguGuild.GetPGuild(guild);
            if (!pGuild) return;

            let { reactionRoles } = pGuild.settings;
            if (!reactionRoles) return;

            let rr = reactionRoles.find(rr => rr.emoteName == reaction.emoji.name && rr.messageID == reaction.message.id);
            if (!rr) return;

            let index = reactionRoles.indexOf(rr);
            reactionRoles[index] = null;

            PinguGuild.UpdatePGuild(client, { settings: pGuild.settings }, pGuild, module.exports.name,
                `Successfully removed ${rr.emoteName} from **${pGuild.name}**'s Pingu Guild.`,
                `Failed to remove ${rr.emoteName} from **${pGuild.name}**'s Pingu Guild.`
            )
        }
        async function ReactionRoleUser() {
            try {
                let role = await ReactionRole.GetReactionRole(client, reaction, user);
                if (!role) return;

                let member = reaction.message.guild.member(user);

                member.roles.remove(role, `ReactionRole in ${reaction.message.channel.name}.`)
                    .catch(err => PinguLibrary.errorLog(message.client, `Unable to remove ${user.username}'s ${role.name} role for unreacting!`, null, err));
                PinguLibrary.consoleLog(client, `Removed ${user.username}'s ${role.name} role for ReactionRole`);

            } catch (err) { PinguLibrary.errorLog(client, `${module.exports.name} error`, null, err); }
        }
    }
);


