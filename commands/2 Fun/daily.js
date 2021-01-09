const { Message, MessageEmbed } = require('discord.js');
const { PinguLibrary, PinguGuild, PinguUser, DiscordPermissions, TimeLeftObject } = require('../../PinguPackage');

module.exports = {
    name: 'daily',
    description: 'Daily streaks',
    usage: '',
    guildOnly: false,
    id: 2,
    examples: [""],
    permissions: [DiscordPermissions.SEND_MESSAGES],
    /**@param {{message: Message, args: string[], pAuthor: PinguUser, pGuild: PinguGuild}}*/
    execute({ message, args, pAuthor, pGuild }) {
        if (!pAuthor) {
            PinguLibrary.errorLog(message.client, `Unable to find pAuthor in daily using **${message.author.tag}**!`);
            return message.channel.send(`I couldn't find your Pingu User profile!`);
        }

        let now = new Date(Date.now());
        let daily = pAuthor.daily;
        if (!daily.lastClaim) return ClaimDaily(1);

        let { lastClaim, nextClaim } = daily;
        let hourDiff = (now.getDate() > lastClaim.getDate() ? 24 : 0) - now.getHours() - lastClaim.getHours();

        if (hourDiff < 18) return message.channel.send(`You've already claimed your daily! Come back in ${nextClaim.toString()} (${nextClaim.endsAt.toLocaleTimeString()}, ${nextClaim.endsAt.toLocaleDateString().replace('.','/').replace('.','/')})`);
        else if (nextClaim.hours + 36 > hourDiff)
            return ClaimDaily(daily.streak += 1);
        return ClaimDaily(1);

        function ClaimDaily(streak) {
            daily.streak = streak;
            daily.lastClaim = now;
            daily.nextClaim = new TimeLeftObject(now, new Date(new Date(Date.now()).setHours(now.getHours() + 18)));

            PinguUser.UpdatePUsersJSONAsync(message.client, message.author, "daily",
                `Successfully updated **${message.author.tag}**'s daily streak.`,
                `Failed updating **${message.author.tag}**'s daily streak`
            );

            return message.channel.send(new MessageEmbed()
                .setThumbnail(pAuthor.avatar)
                .setTitle(`Daily claimed!`)
                .setDescription(`Your daily has been claimed!\n**Streak: ${daily.streak}**`)
                .setColor(message.guild ? pGuild.embedColor : PinguLibrary.DefaultEmbedColor)
                .setFooter(`Next daily claimable at`)
                .setTimestamp(daily.nextClaim.endsAt)
            );
        }
    }
}