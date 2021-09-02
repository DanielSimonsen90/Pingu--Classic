export type AchievementBaseNotificationType = 'NONE';

import { DMChannel, Guild, GuildChannel, MessageEmbed, TextChannel } from "discord.js";
import { PChannel, PAchievement } from "../../../database/json";
import Percentage from "../../../helpers/Percentage";
import AchievementBase from "../items/AchievementBase";
import PinguClientBase from '../../client/PinguClientBase'

export abstract class AchievementConfigBase {
    public enabled: boolean = true;
    public channel: PChannel;
    public achievements: PAchievement[] = new Array<PAchievement>();

    protected static async _notify
    (client: PinguClientBase, achievement: AchievementBase, embedCB: (percentage: Percentage) => MessageEmbed, channel: {_id: string}, notificationType: AchievementBaseNotificationType, guild?: Guild) {
        const [announceChannel, percentage] = await Promise.all([client.channels.fetch(channel._id), achievement.getPercentage(client, guild)]);
        const embed = embedCB(percentage);
        
        client.log('achievement', embed);

        if (notificationType == 'NONE') return null;
        client.DanhoDM(`Messaging ${(guild || (announceChannel as GuildChannel).guild ? guild.members.cache.get(guild.ownerId) : (announceChannel as DMChannel).recipient)} as their notificationtype = ${notificationType}`)
        
        try {
            let message = await (announceChannel as TextChannel).sendEmbeds(embed);
            await message.react(client.emotes.guild(client.savedServers.get('Pingu Support')).get('hypers'));
            return message;
        }
        catch { return null; }
    }
}
export default AchievementConfigBase;