const { MessageEmbed } = require('discord.js');
const { PinguCommand, TimeSpan } = require('PinguPackage');
const timeBetweenClaims = 21;

module.exports = new PinguCommand('daily', 'Fun', `Daily streams just like as if you were having a Snapchat streak with me ;)`, null,
    async ({ client, message, pAuthor, pGuildClient }) => {
        if (!pAuthor) {
            client.log('error', `Unable to find pAuthor in daily using **${message.author.tag}**!`, message.content, null, {
                params: { client, message, pAuthor, pGuildClient }
            });
            return message.channel.send(`I couldn't find your Pingu User profile!`);
        }

        let now = new Date();
        let { daily } = pAuthor;
        if (!daily.lastClaim) return ClaimDaily(1);

        let { lastClaim, nextClaim } = daily;
        let endsAt = new Date(nextClaim.endsAt);
        let lastClaimDate = new Date(lastClaim);

        nextClaim = new TimeSpan(endsAt, now);

        await client.pUsers.update(pAuthor, module.exports.name, `**${message.author.tag}**'s daily endsAt.`);

        let hourDiff = (now.getDate() > lastClaimDate.getDate() ? 24 : 0) - now.getHours() - lastClaimDate.getHours();

        if (nextClaim.toString())
            return message.channel.send(`You've already claimed your daily! Come back in ${nextClaim.toString()} (${client.timeFormat(nextClaim.endsAt.getTime(), 'RELATIVE')})`);
        else if (daily.nextClaim.hours + 36 > hourDiff)
            return ClaimDaily(daily.streak += 1);
        return ClaimDaily(1);

        function ClaimDaily(streak) {
            daily.streak = streak;
            daily.lastClaim = now;
            daily.nextClaim = new TimeSpan(new Date().setHours(now.getHours() + timeBetweenClaims), now);

            setTimeout(async () => await client.pUsers.update(pAuthor, module.exports.name, 
                `Updated **${message.author.tag}**'s daily streak to ${daily.streak}.`
            ), 5000);

            return message.channel.sendEmbeds(new MessageEmbed({
                title: 'Daily claimed!',
                description: `Your daily has been claimed!\n**Streak: ${daily.streak}**`,
                color: pGuildClient.embedColor || client.DefaultEmbedColor,
                footer: { text: `Next daily claimable at` },
                timestamp: daily.nextClaim.endsAt,
                thumbnail: { url: pAuthor.avatar }
            }));
        }
    }
);