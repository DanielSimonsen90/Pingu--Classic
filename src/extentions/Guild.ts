import { Guild, TextChannel, User } from 'discord.js';
import { PChannel } from '../database';
import BasePinguClient from '../pingu/client/BasePinguClient';
import PinguGuildMemberCollection from '../pingu/collection/PinguGuildMemberCollection';
import PinguGuild from '../pingu/guild/PinguGuild';

declare module 'discord.js' {
    interface Guild {
        owner(): GuildMember
        pGuild(): PinguGuild
        member(user: User): GuildMember
        pGuildMembers(): PinguGuildMemberCollection
        welcomeChannel(): TextChannel
    }
}

Guild.prototype.owner = function(this: Guild) {
    return this.members.cache.get(this.ownerId);
}
Guild.prototype.pGuild = function(this: Guild) {
    return (this.client as BasePinguClient).pGuilds.get(this);
}
Guild.prototype.member = function(this: Guild, user: User) {
    return this.members.cache.get(user.id);
}
Guild.prototype.pGuildMembers = function(this: Guild) {
    return this.client.pGuildMembers.get(this);
}
Guild.prototype.welcomeChannel =  function(this: Guild) {
    const pGuild = this.pGuild();
    const pWelcomeChannel = pGuild.settings.welcomeChannel;

    if (pWelcomeChannel) return this.channels.cache.get(pWelcomeChannel._id) as TextChannel;

    const welcomeChannel = (this.channels.cache.find(c => c.isText() && ['welcome', 'door', '🚪'].includes(c.name)) || 
        this.systemChannel ||
        this.channels.cache.find(c => c.isText() && c.name == 'general')) as TextChannel;

    pGuild.settings.welcomeChannel = new PChannel(welcomeChannel);

    if (welcomeChannel) this.client.pGuilds.update(pGuild, module.exports.name, `Added welcome channel to **${this}**'s Pingu Guild.`);

    return welcomeChannel;
}