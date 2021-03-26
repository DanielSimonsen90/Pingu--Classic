import { Client, DMChannel, Guild, MessageEmbed, TextChannel } from "discord.js";
import { PChannel, PAchievement } from "../../../database/json";
import { Percentage } from "../../../helpers/Percentage";
import { SavedServers } from "../../library/PinguLibrary";
import { 
    GuildAchievement, GuildAchievementTypeKey as GuildKey,
    GuildMemberAchievement, GuildMemberAchievementTypeKey as MemberKey,
    UserAchievement, UserAchievementTypeKey as UserKey
} from "../items";

interface AchievementClasses {
    GUILD: GuildAchievement<GuildKey>,
    GUILDMEMBER: GuildMemberAchievement<MemberKey>,
    USER: UserAchievement<UserKey>
}

export abstract class AchievementConfigBase {
    public enabled: boolean = true;
    public channel: PChannel;
    public achievements: PAchievement[];

    protected async _notify
    <AchieverType extends keyof AchievementClasses>
    (client: Client, achievement: AchievementClasses[AchieverType], embed: (percentage: Percentage) => MessageEmbed, channel?: DMChannel | TextChannel, guild?: Guild) {
        let announceChannel = channel? channel : (await client.channels.fetch(this.channel._id) as TextChannel);
        let percentage = await achievement.getPercentage(guild);
        let message = await announceChannel.send(embed(percentage));
        await message.react(SavedServers.PinguSupport(client).emojis.cache.find(e => e.name == 'hypers'));
        return message;
    }
}