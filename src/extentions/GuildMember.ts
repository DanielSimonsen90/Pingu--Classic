import { GuildMember } from "discord.js";
import PinguGuildMember from "../pingu/guildMember/PinguGuildMember";

declare module 'discord.js' {
    interface GuildMember {
        pGuildMember(): PinguGuildMember
    }
}

GuildMember.prototype.pGuildMember = function(this: GuildMember) {
    return this.client.pGuildMembers.get(this.guild).get(this);
}