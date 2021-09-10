export type AchieverTypes = 'USER' | 'GUILD' | 'GUILDMEMBER';

import { PinguClientEvents } from "../../handlers/Pingu/PinguEvent";
export interface AchievementBaseType {
    CHAT: string,
    EVENT: keyof PinguClientEvents
    COMMAND: Commands
}

export type noGuildOnlyCommands = 
    'help' | 'info' | 'ping' | 'sort' | 'spinthewheel' | //Utility
    'fact' | 'gif' | 'marry' | 'meme' | 'noot' | 'daily' | 'tell' |  //Fun
    'contact' | 'invite'; //Supporting
export type guildOnlyCommands = 
    'giveaway' | 'poll' | 'suggestion' | 'serverinfo' | 'whois' | 'clear' | 'role' | 'embed' | 'fetch' | 'prefix' | 'publish' | 'reactionroles' | 'slowmode' |
    'boomer' | 'activity' | 'noice' | 'music' | 'quote' | 'viberate';
export type Commands = noGuildOnlyCommands | guildOnlyCommands

import { Guild, Message, VoiceState } from "discord.js";
import { PinguCommandParams } from "../../handlers/Pingu/PinguCommand";
export interface PinguCommandParamsResponse extends PinguCommandParams {
    response: Message
}

export interface AchievementCallbackParams {
    CHAT: [[string, Message]],
    EVENT: PinguClientEvents,
    COMMAND: [[PinguCommandParamsResponse]]
    VOICE: [[VoiceState]]
}

import PItem from "../../../database/json/PItem";
import Percentage from "../../../helpers/Percentage";
import PinguClientBase from '../../client/PinguClientBase'

export abstract class AchievementBase extends PItem {
    constructor(id: number, name: string, description: string) {
        super({ id: id.toString(), name });
        this.description = description;
    }

    public description: string;
    
    public abstract getPercentage(client: PinguClientBase, guild?: Guild): Promise<Percentage>;
    protected static useCommand(command: Commands, extraInfo: string) {
        return `Use the \`${command}\` command to ${extraInfo}`;
    }
}

export default AchievementBase;