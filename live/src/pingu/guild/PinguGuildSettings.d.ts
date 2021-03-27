import { Guild } from 'discord.js';
import { PChannel } from '../../database/json';
import { PinguGuildConfig } from "./PinguGuildConfig";
import { ReactionRole } from './items';
export declare class PinguGuildSettings {
    constructor(guild: Guild);
    welcomeChannel: PChannel;
    config: PinguGuildConfig;
    reactionRoles: ReactionRole[];
}
