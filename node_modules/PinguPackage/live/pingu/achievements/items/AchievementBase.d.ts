import { PItem } from "../../../database/json/PItem";
import { PinguClientEvents } from "../../handlers/PinguEvent";
export declare type noGuildOnlyCommands = 'help' | 'info' | 'ping' | 'sort' | 'spinthewheel' | //Utility
'fact' | 'gif' | 'meme' | 'noot' | 'daily' | 'tell' | //Fun
'contact' | 'invite';
export declare type guildOnlyCommands = 'giveaway' | 'poll' | 'suggestion' | 'serverinfo' | 'whois' | 'clear' | 'role' | 'embed' | 'fetch' | 'prefix' | 'publish' | 'reactionroles' | 'slowmode' | 'boomer' | 'activity' | 'noice' | 'music' | 'marry' | 'quote' | 'viberate';
export declare type Commands = noGuildOnlyCommands | guildOnlyCommands;
export declare type AchieverTypes = 'USER' | 'GUILD' | 'GUILDMEMBER';
export interface AchievementBaseType {
    CHAT: string;
    EVENT: keyof PinguClientEvents;
    COMMAND: Commands;
}
export declare abstract class AchievementBase extends PItem {
    constructor(id: number, name: string, description: string);
    description: string;
}
