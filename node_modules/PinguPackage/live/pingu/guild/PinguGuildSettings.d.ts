import { Guild } from 'discord.js';
import PChannel from '../../database/json/PChannel';
import PinguGuildConfig from "./PinguGuildConfig";
import ReactionRole from './items/ReactionRole';
export declare class PinguGuildSettings {
    constructor(guild: Guild);
    welcomeChannel: PChannel;
    config: PinguGuildConfig;
    reactionRoles: ReactionRole[];
}
export default PinguGuildSettings;
