const { MessageEmbed } = require('discord.js');
const { PinguCommand, PinguLibrary, PinguUser, TimeLeftObject } = require('PinguPackage');
const timeBetweenClaims = 21;

module.exports = new PinguCommand('daily', 'Fun', `Daily streams just like as if you were having a Snapchat streak with me ;)`, null,
    async ({ client, message, pAuthor, pGuildClient }) => {
        if (!pAuthor) {
            PinguLibrary.errorLog(client, `Unable to find pAuthor in daily using **${message.author.tag}**!`, message.content, null, {
                params: { client, message, pAuthor, pGuildClient }
            });
            return message.channel.send(`I couldn't find your Pingu User profile!`);
        }

        let now = new Date(Date.now());
        let daily = pAuthor.daily;
        if (!daily.lastClaim) return ClaimDaily(1);

        let { lastClaim, nextClaim } = daily;
        let endsAt = new Date(nextClaim.endsAt);
        let lastClaimDate = new Date(lastClaim);

        nextClaim = new TimeLeftObject(now, endsAt);

        PinguUser.Update(client, ['daily'], pAuthor, module.exports.name, `**${message.author.tag}**'s daily endsAt.`);

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
            daily.nextClaim = new TimeLeftObject(now, new Date(new Date(Date.now()).setHours(now.getHours() + timeBetweenClaims)));

            setTimeout(async () => await PinguUser.Update(client, ['daily'], pAuthor, "daily",
                `Updated **${message.author.tag}**'s daily streak to ${daily.streak}.`
            ), 5000);

            return message.channel.send(new MessageEmbed()
                .setThumbnail(pAuthor.avatar)
                .setTitle(`Daily claimed!`)
                .setDescription(`Your daily has been claimed!\n**Streak: ${daily.streak}**`)
                .setColor(message.guild ? pGuildClient.embedColor : client.DefaultEmbedColor)
                .setFooter(`Next daily claimable at`)
                .setTimestamp(daily.nextClaim.endsAt)
            );
        }
    }
);