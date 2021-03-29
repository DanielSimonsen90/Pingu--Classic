import { Client, Collection, Guild, GuildMember, Snowflake } from 'discord.js';
import { PItem, PClient, PGuildMember } from '../../database/json';
import { PinguGuildSettings } from './PinguGuildSettings';
import { PinguGuildMember } from "../guildMember/PinguGuildMember";
export declare function WritePGuild(client: Client, guild: Guild, scriptName: string, succMsg: string, errMsg: string): Promise<void>;
export declare function GetPGuild(guild: Guild): Promise<PinguGuild>;
export declare function UpdatePGuild(client: Client, updatedProperty: object, pGuild: PinguGuild, scriptName: string, succMsg: string, errMsg: string): Promise<any>;
export declare function DeletePGuild(client: Client, guild: Guild, scriptName: string, succMsg: string, errMsg: string): Promise<PinguGuild>;
export declare function GetPGuilds(): Promise<PinguGuild[]>;
export declare const cache: Collection<string, PinguGuild>;
export declare class PinguGuild extends PItem {
    static WritePGuild(client: Client, guild: Guild, scriptName: string, succMsg: string, errMsg: string): Promise<void>;
    static GetPGuild(guild: Guild): Promise<PinguGuild>;
    static UpdatePGuild(client: Client, updatedProperty: object, pGuild: PinguGuild, scriptName: string, succMsg: string, errMsg: string): Promise<any>;
    static DeletePGuild(client: Client, guild: Guild, scriptName: string, succMsg: string, errMsg: string): Promise<PinguGuild>;
    static GetPGuilds(): Promise<PinguGuild[]>;
    constructor(guild: Guild, owner?: GuildMember);
    guildOwner: PGuildMember;
    clients: PClient[];
    members: Map<Snowflake, PinguGuildMember>;
    settings: PinguGuildSettings;
}
