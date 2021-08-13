import PinguGuildMember from "../pingu/guildMember/PinguGuildMember";
declare module 'discord.js' {
    interface GuildMember {
        pGuildMember(): PinguGuildMember;
    }
}
