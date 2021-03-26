import { PItem } from "../../../database/json/PItem";
import { PinguClientEvents } from "../../handlers/PinguEvent";
import { PinguCommandParams } from "../../handlers/PinguCommand";
import { Guild } from "discord.js";
import { Percentage } from "../../../helpers/Percentage";

export type AchieverTypes = 'USER' | 'GUILD' | 'GUILDMEMBER';

export interface AchievementBaseType {
    CHAT: string,
    EVENT: keyof PinguClientEvents
    COMMAND: Commands
}

export type noGuildOnlyCommands = 
    'help' | 'info' | 'ping' | 'sort' | 'spinthewheel' | //Utility
    'fact' | 'gif' | 'meme' | 'noot' | 'daily' | 'tell' |  //Fun
    'contact' | 'invite'; //Supporting
export type guildOnlyCommands = 
    'giveaway' | 'poll' | 'suggestion' | 'serverinfo' | 'whois' | 'clear' | 'role' | 'embed' | 'fetch' | 'prefix' | 'publish' | 'reactionroles' | 'slowmode' |
    'boomer' | 'activity' | 'noice' | 'music' | 'marry' | 'quote' | 'viberate';
export type Commands = noGuildOnlyCommands | guildOnlyCommands

export interface AchievementCallbackParams {
    CHAT: [string],
    EVENT: PinguClientEvents,
    COMMAND: [PinguCommandParams]
}


export abstract class AchievementBase
<Key extends keyof AchievementBaseType, 
Type extends AchievementBaseType[Key]> 
extends PItem {
    constructor(id: number, name: string, key: Key, type: Type, description: string) {
        super({ id: id.toString(), name });

        this.key = key;
        this.type = type;
        this.description = description;
    }

    public key: Key;
    public type: Type;
    public description: string
    public setCallback<setCBType extends keyof AchievementCallbackParams[Key]>
    (
        type: setCBType,
        callback: (params: AchievementCallbackParams[Key][setCBType]) => boolean
    ) { 
        this.callback = callback;
        return this;
    }
    public callback(params: AchievementCallbackParams[Key][keyof AchievementCallbackParams[Key]]) {
        return true;
    }

    public abstract getPercentage(guild?: Guild): Promise<Percentage>;
}