import { ClientEvents, Collection, TextChannel, User, Guild, Message } from "discord.js";
import PinguGuild from '../guild/PinguGuild';
import PClient from '../../database/json/PClient';
import { AchievementCheckData } from '../achievements';
import { GuildMemberAchievementType } from '../achievements/items/GuildMemberAchievement';
import { GuildAchievementType } from '../achievements/items/GuildAchievement';
import { AchievementBaseType } from '../achievements/items/AchievementBase';
import PinguCommand from '../handlers/PinguCommand';
import PinguEvent, { PinguClientEvents } from '../handlers/PinguEvent';
import PinguClientBase from "./PinguClientBase";
export declare class PinguClient extends PinguClientBase<PinguClientEvents> {
    commands: Collection<string, PinguCommand>;
    events: Collection<keyof PinguClientEvents, PinguEvent<keyof PinguClientEvents>>;
    subscribedEvents: Array<keyof PinguClientEvents>;
    toPClient(pGuild: PinguGuild): PClient;
    emit<PCE extends keyof PinguClientEvents, CE extends keyof ClientEvents>(key: PCE, ...args: PinguClientEvents[PCE]): boolean;
    getSharedServers(user: User): Guild[];
    getTextChannel(guildId: string, channelName: string): TextChannel;
    getImage(script: string, imageName: string, extension?: 'png' | 'gif' | 'jpg'): string;
    getBadges(user: User): Promise<Collection<import("../badge/PinguBadge").IAmBadge, import("../badge/PinguBadge").PinguBadge>>;
    requestImage(message: Message, pGuildClient: PClient, caller: 'gif' | 'meme', types: string[], searchTerm?: (type: string) => string): Promise<Message>;
    AchievementCheck<AchievementType extends GuildMemberAchievementType | GuildAchievementType | AchievementBaseType, Key extends keyof AchievementType, Type extends AchievementType[Key]>(data: AchievementCheckData, key: Key, type: Type, callbackParams: any[]): Promise<boolean>;
    protected handlePath(path: string, type: 'command' | 'event'): void;
    private handleEvent;
}
export default PinguClient;
