export type Channels = 'Giveaway' | 'Poll' | 'Suggestion' | 'Emotes';
export type Voices = 'Connected' | 'Disconnected' | 'Move' | 'Deaf' | 'Mute' | 'Streaming' | 'Video' | 'Noice'
export type Moderation = 'Ban' | 'Unban' | 'Censor' | 'Clear' | 'Kick' | 'Logs' | 'Mute' | 'Unmute' | 'Warn'

import { Guild, GuildMember, User, GuildChannel } from "discord.js";
import { AchievementBase, AchievementBaseType, guildOnlyCommands, AchievementCallbackParams } from "./AchievementBase";
export interface GuildAchievementType extends AchievementBaseType {
    COMMAND: guildOnlyCommands,
    CHANNEL: Channels,
    VOICE: Voices,
    MODERATION: Moderation
}
export type GuildAchievementTypeKey = keyof GuildAchievementType;

export interface GuildAchievementCallbackParams extends AchievementCallbackParams {
    MODERATION: [[Guild, GuildMember, User]],
    CHANNEL: [[GuildChannel]]
}

export function useChannel(channel: Channels, extraInfo: string) {
    return `Use the #${channel.toLowerCase()} channel to ${extraInfo}`;
}

import { IGuildAchievement } from "./IAchievementBase";
import Percentage from "../../../helpers/Percentage";
import { GetPinguGuilds } from "../../guild/PinguGuild";

export class GuildAchievement
<Key extends keyof GuildAchievementType,
Type extends GuildAchievementType[Key]> 
extends AchievementBase implements IGuildAchievement<Key, Type, GuildAchievementCallbackParams> {
    constructor(id: number, name: string, key: Key, type: Type, description: string) {
        super(id, name, description);
        this.key = key;
        this.type = type;
    }

    public key: Key;
    public type: Type;

    public setCallback<setCBType extends keyof GuildAchievementCallbackParams[Key]>
    (
        type: setCBType, 
        callback: (params: GuildAchievementCallbackParams[Key][setCBType]) => Promise<boolean>
    ): this {
        this.callback = callback;
        return this;
    }
    public async callback(params: GuildAchievementCallbackParams[Key][keyof GuildAchievementCallbackParams[Key]]): Promise<boolean> {
        return true
    }

    public async getPercentage() {
        let pGuilds = await GetPinguGuilds();
        let whole = pGuilds.length;
        let part = pGuilds.filter(pGuild => pGuild.settings.config.achievements.achievements.find(a => a._id == this._id)).length;
        return new Percentage(whole, part);
    }

    protected static useCommand(command: guildOnlyCommands, extraInfo: string) {
        return `Have a member use the \`${command}\` command to ${extraInfo}`;
    }

    public static Achievements = [
        new GuildAchievement(1, "What message?", 'EVENT', 'messageDelete', "Have a message deleted in a channel"),
        new GuildAchievement(2, "The forgotten mesages", 'EVENT', 'messageDeleteBulk', "Have multiple messages deleted in a channel"),
        new GuildAchievement(3, "It's a gift!", 'COMMAND', 'giveaway', "Have a giveaway hosted in the server")
            .setCallback('0', async ([params]) => params.response?.embeds[0]?.title?.includes('New Giveaway!')),
        new GuildAchievement(4, "The senate will decide your fate", 'COMMAND', 'poll', "Have a poll hosted in the server")
            .setCallback('0', async ([params]) => params.response?.embeds[0]?.title?.includes('New Poll!')),
        new GuildAchievement(5, "There's still room for improvement...", 'COMMAND', 'suggestion', "Have a server member use the `suggestion` command")
            .setCallback('0', async ([params]) => params.response?.embeds[0]?.title?.includes('New Suggestion!')),
        new GuildAchievement(6, "Poof!", 'COMMAND', 'clear', GuildAchievement.useCommand('clear', 'clear one or more messages')),
        new GuildAchievement(7, "Pretty message!", 'COMMAND', 'embed', GuildAchievement.useCommand('embed', "make a custom embed")),
        new GuildAchievement(8, "Let's give you a new look...", 'COMMAND', 'prefix', "Change the prefix of Pingu"),
        new GuildAchievement(9, 'Out to the followers!', 'COMMAND', 'publish', GuildAchievement.useCommand('publish', "publish a message in an announcement channel")),
        new GuildAchievement(10, "You decide your view of the server!", 'COMMAND', 'reactionroles', 'Set up ReactionRoles on the server')
            .setCallback('0', async ([params]) => params.response?.embeds[0]?.title?.includes('ReactionRole Created!')),
        new GuildAchievement(11, "Slow down there!", 'COMMAND', 'slowmode', GuildAchievement.useCommand('slowmode', "setup a custom slowmode number")),
        new GuildAchievement(12, "From Discord to roleplay", 'COMMAND', 'activity', GuildAchievement.useCommand('activity', '"roleplay" with someone')),
        new GuildAchievement(13, "We gotta get schwifty!", 'COMMAND', 'music', GuildAchievement.useCommand('music', "play some music in a voice channel")),
        new GuildAchievement(14, "I love my members!", 'CHANNEL', 'Giveaway', 'Setup a giveaway channel to the server'),
        new GuildAchievement(15, "What do you guys think?", 'CHANNEL', 'Poll', 'Setup a poll channel to the server'),
        new GuildAchievement(16, "I will listen- I promise!", 'CHANNEL', 'Suggestion', 'Setup a suggestion channel to the server'),
        new GuildAchievement(17, "Discord? More like another streaming service", 'VOICE', 'Streaming', "Have a member live stream in a channel"),
        new GuildAchievement(18, "Ewww you guys use Zoom?", 'VOICE', 'Video', "Have a member enable their camera in a voice channel"),
        new GuildAchievement(19, "The Government of China", 'MODERATION', 'Logs', "Setup a logs channel to moderate the server's events"),
        new GuildAchievement(20, "We are the chosen ones!", 'EVENT', 'chosenGuild', 'Become the chosen server in Pingu Support'),
    ]
}

export default GuildAchievement;