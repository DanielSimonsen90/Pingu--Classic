import { Guild } from 'discord.js';

declare module 'discord.js' {
    export interface Guild {
        owner(): GuildMember;
    }
}

Guild.prototype.owner = function(this: Guild) {
    return this.members.cache.get(this.ownerId);
}