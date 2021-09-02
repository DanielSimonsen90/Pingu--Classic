import { GuildMember, Guild } from 'discord.js';
import PinguClientBase from '../client/PinguClientBase';
import PinguGuildMember from '../guildMember/PinguGuildMember';
import IPinguCollection from './IPinguCollection';
export declare class PinguGuildMemberCollection extends IPinguCollection<GuildMember, PinguGuildMember> {
    constructor(client: PinguClientBase, logChannelName: string, guild: Guild);
    private _guild;
    private get pGuild();
    add(item: GuildMember, scriptName: string, reason?: string): Promise<PinguGuildMember>;
    update(pItem: PinguGuildMember, scriptName: string, reason: string): Promise<PinguGuildMember>;
    delete(item: GuildMember, scriptName: string, reason: string): Promise<this>;
    refresh(client?: PinguClientBase, startUp?: boolean): Promise<this>;
    get(item: GuildMember): PinguGuildMember;
}
export default PinguGuildMemberCollection;
