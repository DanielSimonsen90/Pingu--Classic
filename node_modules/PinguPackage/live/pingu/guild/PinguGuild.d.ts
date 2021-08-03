import { Guild, GuildMember, Snowflake } from 'discord.js';
import { PItem, PClient, PGuildMember } from '../../database/json';
import PinguGuildSettings from './PinguGuildSettings';
import PinguGuildMember from "../guildMember/PinguGuildMember";
export declare class PinguGuild extends PItem {
    constructor(guild: Guild, owner?: GuildMember);
    guildOwner: PGuildMember;
    clients: PClient[];
    members: Map<Snowflake, PinguGuildMember>;
    settings: PinguGuildSettings;
    joinedAt: Date;
}
export default PinguGuild;
