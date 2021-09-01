import { GuildMember, Guild } from 'discord.js';
import PinguClientShell from '../client/PinguClientShell';
import PinguGuildMember from '../guildMember/PinguGuildMember';
import IPinguCollection from './IPinguCollection';
export declare class PinguGuildMemberCollection extends IPinguCollection<GuildMember, PinguGuildMember> {
    constructor(client: PinguClientShell, logChannelName: string, guild: Guild);
    private _guild;
    private get pGuild();
    add(item: GuildMember, scriptName: string, reason?: string): Promise<PinguGuildMember>;
    update(pItem: PinguGuildMember, scriptName: string, reason: string): Promise<PinguGuildMember>;
    delete(item: GuildMember, scriptName: string, reason: string): Promise<this>;
    refresh(client?: PinguClientShell, startUp?: boolean): Promise<this>;
    get(item: GuildMember): PinguGuildMember;
}
export default PinguGuildMemberCollection;
