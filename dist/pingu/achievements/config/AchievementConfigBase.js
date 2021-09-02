"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AchievementConfigBase = void 0;
class AchievementConfigBase {
    enabled = true;
    channel;
    achievements = new Array();
    static async _notify(client, achievement, embedCB, channel, notificationType, guild) {
        const [announceChannel, percentage] = await Promise.all([client.channels.fetch(channel._id), achievement.getPercentage(client, guild)]);
        const embed = embedCB(percentage);
        client.log('achievement', embed);
        if (notificationType == 'NONE')
            return null;
        client.DanhoDM(`Messaging ${(guild || announceChannel.guild ? guild.members.cache.get(guild.ownerId) : announceChannel.recipient)} as their notificationtype = ${notificationType}`);
        try {
            let message = await announceChannel.sendEmbeds(embed);
            await message.react(client.emotes.guild(client.savedServers.get('Pingu Support')).get('hypers'));
            return message;
        }
        catch {
            return null;
        }
    }
}
exports.AchievementConfigBase = AchievementConfigBase;
exports.default = AchievementConfigBase;
