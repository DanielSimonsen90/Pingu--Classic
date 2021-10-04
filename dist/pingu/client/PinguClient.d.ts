import { ClientEvents, Collection, TextChannel, User, Guild, Message, PermissionString, ClientOptions } from "discord.js";
import PClient from '../../database/json/PClient';
import { AchievementCheckData } from '../achievements';
import { GuildMemberAchievementType } from '../achievements/items/GuildMemberAchievement';
import { GuildAchievementType } from '../achievements/items/GuildAchievement';
import { AchievementBaseType } from '../achievements/items/AchievementBase';
import PinguCommand from '../handlers/Pingu/PinguCommand';
import PinguEvent, { PinguClientEvents } from '../handlers/Pingu/PinguEvent';
import PinguClientBase from "./PinguClientBase";
import IConfigRequirements from "../../helpers/Config";
export declare class PinguClient extends PinguClientBase<PinguClientEvents> {
    constructor(config: IConfigRequirements, permissions: PermissionString[], subscribedEvents: Array<keyof PinguClientEvents>, dirname: string, commandsPath?: string, eventsPath?: string, options?: ClientOptions);
    commands: Collection<string, PinguCommand>;
    events: Collection<keyof PinguClientEvents, PinguEvent<keyof PinguClientEvents>>;
    subscribedEvents: Array<keyof PinguClientEvents>;
    emit<PCE extends keyof PinguClientEvents, CE extends keyof ClientEvents>(key: PCE, ...args: PinguClientEvents[PCE]): boolean;
    getSharedServers(user: User): Guild[];
    getTextChannel(guildId: string, channelName: string): TextChannel;
    getImage(script: string, imageName: string, extension?: 'png' | 'gif' | 'jpg'): string;
    getBadges(user: User): Promise<Collection<import("../badge/PinguBadge").IAmBadge, import("../badge/PinguBadge").PinguBadge>>;
    requestImage(message: Message, pGuildClient: PClient, caller: 'gif' | 'meme', types: string[], searchTerm?: (type: string) => string): Promise<Message>;
    AchievementCheck<AchievementType extends GuildMemberAchievementType | GuildAchievementType | AchievementBaseType, Key extends keyof AchievementType, Type extends AchievementType[Key]>(data: AchievementCheckData, key: Key, type: Type, callbackParams: any[]): Promise<boolean>;
    postSlashCommands(): Promise<import("../collection/SlashCommandCollection").default>;
    protected handlePath(path: string, type: 'command' | 'event'): void;
    private handleEvent;
}
export default PinguClient;
