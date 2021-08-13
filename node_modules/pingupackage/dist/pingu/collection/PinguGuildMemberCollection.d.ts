import { GuildMember, Guild } from 'discord.js';
import BasePinguClient from '../client/BasePinguClient';
import PinguGuildMember from '../guildMember/PinguGuildMember';
import IPinguCollection from './IPinguCollection';
export declare class PinguGuildMemberCollection extends IPinguCollection<GuildMember, PinguGuildMember> {
    constructor(client: BasePinguClient, logChannelName: string, guild: Guild);
    private _guild;
    private get pGuild();
    add(item: GuildMember, scriptName: string, reason?: string): Promise<PinguGuildMember>;
    update(pItem: PinguGuildMember, scriptName: string, reason: string): Promise<PinguGuildMember>;
    delete(item: GuildMember, scriptName: string, reason: string): Promise<this>;
    refresh(client?: BasePinguClient): Promise<this>;
    get(item: GuildMember): PinguGuildMember;
}
export default PinguGuildMemberCollection;
