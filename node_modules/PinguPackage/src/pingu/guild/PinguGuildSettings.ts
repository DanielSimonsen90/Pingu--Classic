import { Guild } from 'discord.js';

import PChannel from '../../database/json/PChannel';
import PinguGuildConfig from "./PinguGuildConfig";

import ReactionRole from './items/ReactionRole';

export class PinguGuildSettings {
    constructor(guild: Guild) {
        let welcomeChannel = guild.channels.cache.find(c => c.isText() && c.name.includes('welcome')) ||
            guild.channels.cache.find(c => c.isText() && c.name == 'general');

        if (welcomeChannel) this.welcomeChannel = new PChannel(welcomeChannel);

        this.config = new PinguGuildConfig(guild);
        this.reactionRoles = new Array<ReactionRole>();
    }

    public welcomeChannel: PChannel;
    public config: PinguGuildConfig;
    public reactionRoles: ReactionRole[];
}

export default PinguGuildSettings;