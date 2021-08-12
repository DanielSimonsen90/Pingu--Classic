import PinguGuildMemberCollection from '../pingu/collection/PinguGuildMemberCollection';
import PinguGuild from '../pingu/guild/PinguGuild';
declare module 'discord.js' {
    interface Guild {
        owner(): GuildMember;
        pGuild(): PinguGuild;
        member(user: User): GuildMember;
        pGuildMembers(): PinguGuildMemberCollection;
        welcomeChannel(): TextChannel;
    }
}
