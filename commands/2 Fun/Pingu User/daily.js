const { Message, MessageEmbed } = require('discord.js');
const { PinguLibrary, PinguGuild, PinguUser, DiscordPermissions, TimeLeftObject, PClient } = require('PinguPackage');
const timeBetweenClaims = 21;

module.exports = {
    name: 'daily',
    description: 'Daily streaks',
    usage: '',
    guildOnly: false,
    id: 2,
    examples: [""],
    permissions: [DiscordPermissions.SEND_MESSAGES],
    /**@param {{message: Message, args: string[], pAuthor: PinguUser, pGuildClient: PClient}}*/
    execute({ message, args, pAuthor, pGuildClient }) {
        if (!pAuthor) {
            PinguLibrary.errorLog(message.client, `Unable to find pAuthor in daily using **${message.author.tag}**!`);
            return message.channel.send(`I couldn't find your Pingu User profile!`);
        }

        let now = new Date(Date.now());
        let daily = pAuthor.daily;
        if (!daily.lastClaim) return ClaimDaily(1);

        let { lastClaim, nextClaim } = daily;
        let endsAt = new Date(nextClaim.endsAt);
        let lastClaimDate = new Date(lastClaim);

        nextClaim = new TimeLeftObject(now, endsAt);

        PinguUser.UpdatePUser(message.client, { daily }, pAuthor, "daily",
            `Successfully updated **${message.author.tag}**'s daily endsAt.`,
            `Failed updating **${message.author.tag}**'s daily endsAt`
        );

        let hourDiff = (now.getDate() > lastClaimDate.getDate() ? 24 : 0) - now.getHours() - lastClaimDate.getHours();

        if (nextClaim.toString())
            return message.channel.send(`You've already claimed your daily! Come back in ${nextClaim.toString()} (**${endsAt.toLocaleTimeString('da-DK')}**, **${endsAt.toLocaleDateString('da-DK', { formatMatcher: "dd-MM-YY" })}**)`);
        else if (daily.nextClaim.hours + 36 > hourDiff)
            return ClaimDaily(daily.streak += 1);
        return ClaimDaily(1);

        function ClaimDaily(streak) {
            daily.streak = streak;
            daily.lastClaim = now;
            daily.nextClaim = new TimeLeftObject(now, new Date(new Date(Date.now()).setHours(now.getHours() + timeBetweenClaims)));

            message.channel.send(new MessageEmbed()
                .setThumbnail(pAuthor.avatar)
                .setTitle(`Daily claimed!`)
                .setDescription(`Your daily has been claimed!\n**Streak: ${daily.streak}**`)
                .setColor(message.guild ? pGuildClient.embedColor : PinguLibrary.DefaultEmbedColor)
                .setFooter(`Next daily claimable at`)
                .setTimestamp(daily.nextClaim.endsAt)
            );

            setTimeout(async () => await PinguUser.UpdatePUser(message.client, { daily: pAuthor.daily }, pAuthor, "daily",
                `Successfully updated **${message.author.tag}**'s daily streak.`,
                `Failed updating **${message.author.tag}**'s daily streak`
            ), 5000);
        }
    }
}