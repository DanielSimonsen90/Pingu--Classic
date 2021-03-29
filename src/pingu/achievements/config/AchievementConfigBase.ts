import { Client, DMChannel, Guild, MessageEmbed, TextChannel } from "discord.js";
import { PChannel, PAchievement } from "../../../database/json";
import { Percentage } from "../../../helpers/Percentage";
import { SavedServers } from "../../library/PinguLibrary";
import { 
    GuildAchievement, GuildAchievementType, 
    GuildMemberAchievement, GuildMemberAchievementType,
    UserAchievement, UserAchievementType
} from "../items";
import { AchievementBase } from "../items/AchievementBase";

type NotifyAchievementType = 
    GuildAchievement<keyof GuildAchievementType, GuildAchievementType[keyof GuildAchievementType]> |
    GuildMemberAchievement<keyof GuildMemberAchievementType, GuildMemberAchievementType[keyof GuildMemberAchievementType]> |
    UserAchievement<keyof UserAchievementType, UserAchievementType[keyof UserAchievementType]>

export abstract class AchievementConfigBase {
    public enabled: boolean = true;
    public channel: PChannel;
    public achievements: PAchievement[];

    protected static async _notify
    (client: Client, achievement: AchievementBase, embed: (percentage: Percentage) => MessageEmbed, channel: {_id: string}, guild?: Guild) {
        const [announceChannel, percentage] = await Promise.all([client.channels.fetch(channel._id), achievement.getPercentage(guild)]);
        let message = await (announceChannel as TextChannel).send(embed(percentage));
        await message.react(SavedServers.PinguSupport(client).emojis.cache.find(e => e.name == 'hypers'));
        return message;
    }
}