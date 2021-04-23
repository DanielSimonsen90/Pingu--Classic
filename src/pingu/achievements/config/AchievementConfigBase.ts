export type AchievementBaseNotificationType = 'NONE';

import { Client, Guild, MessageEmbed, TextChannel } from "discord.js";
import { PChannel, PAchievement } from "../../../database/json";
import { Percentage } from "../../../helpers/Percentage";
import { SavedServers, achievementLog } from "../../library/PinguLibrary";
import { AchievementBase } from "../items/AchievementBase";

export abstract class AchievementConfigBase {
    public enabled: boolean = true;
    public channel: PChannel;
    public achievements: PAchievement[] = new Array<PAchievement>();

    protected static async _notify
    (client: Client, achievement: AchievementBase, embedCB: (percentage: Percentage) => MessageEmbed, channel: {_id: string}, notificationType: AchievementBaseNotificationType, guild?: Guild) {
        const [announceChannel, percentage] = await Promise.all([client.channels.fetch(channel._id), achievement.getPercentage(guild)]);
        const embed = embedCB(percentage);
        
        achievementLog(client, embed)

        if (notificationType == 'NONE') return null;      
        try {
            let message = await (announceChannel as TextChannel).send(embed);
            await message.react(SavedServers.get('Pingu Support').emojis.cache.find(e => e.name == 'hypers'));
            return message;
        }
        catch { return null; }
    }
}