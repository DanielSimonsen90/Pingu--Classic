const { MessageEmbed } = require('discord.js');
const { PinguCommand, TimeLeftObject } = require('PinguPackage');
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

        nextClaim = new TimeLeftObject(now, endsAt);

        await client.pUsers.update(pAuthor, module.exports.name, `**${message.author.tag}**'s daily endsAt.`);

        let hourDiff = (now.getDate() > lastClaimDate.getDate() ? 24 : 0) - now.getHours() - lastClaimDate.getHours();
        const format = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        };

        if (nextClaim.toString())
            return message.channel.send(`You've already claimed your daily! Come back in ${nextClaim.toString()} (<t:${Math.round(nextClaim.endsAt.getTime() / 1000)}:R>)`);
        else if (daily.nextClaim.hours + 36 > hourDiff)
            return ClaimDaily(daily.streak += 1);
        return ClaimDaily(1);

        function ClaimDaily(streak) {
            daily.streak = streak;
            daily.lastClaim = now;
            daily.nextClaim = new TimeLeftObject(now, new Date(new Date().setHours(now.getHours() + timeBetweenClaims)));

            setTimeout(async () => await client.pUsers.update(pAuthor, module.exports.name, 
                `Updated **${message.author.tag}**'s daily streak to ${daily.streak}.`
            ), 5000);

            return message.channel.send(new MessageEmbed({
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