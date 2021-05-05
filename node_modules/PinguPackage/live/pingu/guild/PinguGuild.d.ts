import { Client, Collection, Guild, GuildMember, Snowflake } from 'discord.js';
import { PItem, PClient, PGuildMember } from '../../database/json';
import PinguGuildSettings from './PinguGuildSettings';
import PinguGuildMember from "../guildMember/PinguGuildMember";
export declare function WritePGuild(client: Client, guild: Guild, scriptName: string, reason: string): Promise<PinguGuild>;
export declare function GetPGuild(guild: Guild): Promise<PinguGuild>;
declare type PinguGuildUpdate = 'name' | 'guildOwner' | 'clients' | 'members' | 'settings';
export declare function UpdatePGuild(client: Client, updatedProperties: PinguGuildUpdate[], pGuild: PinguGuild, scriptName: string, reason: string): Promise<PinguGuild>;
export declare function DeletePGuild(client: Client, guild: Guild, scriptName: string, reason: string): Promise<void>;
export declare function GetPinguGuilds(): Promise<PinguGuild[]>;
export declare const cache: Collection<string, PinguGuild>;
export declare class PinguGuild extends PItem {
    /**Creates and saves Guild as a PinguGuild and returns the new PinguGuild object
     * @param client Client that called the method
     * @param guild Guild to create a PinguGuild for
     * @param scriptName Script that called the write method
     * @param reason Reason for creating a new PinguGuild
     * @returns Guild converted to PinguGuild*/
    static Write(client: Client, guild: Guild, scriptName: string, reason: string): Promise<PinguGuild>;
    /**Get PinguGuild from Guild
     * @param guild Guild to get the PinguGuild for
     * @returns The Guild converted to PinguGuild*/
    static Get(guild: Guild): Promise<PinguGuild>;
    /**Updates specified PinguGuild to the database
     * @param client Client that called the method
     * @param updatedProperties List of property names that are being updated
     * @param pGuild Pingu Guild object that is being updated
     * @param scriptName Script that called the method
     * @param reason Reason for updating the PinguGuild
     * @returns The updated PinguGuild*/
    static Update(client: Client, updatedProperties: PinguGuildUpdate[], pGuild: PinguGuild, scriptName: string, reason: string): Promise<PinguGuild>;
    /**Deletes the guild from the PinguGuild database
     * @param client Client that called the method
     * @param guild Guild to be deleted
     * @param scriptName Script that called the method
     * @param reason Reason for deleting the PinguGuild
     * @returns what should it return?*/
    static Delete(client: Client, guild: Guild, scriptName: string, reason: string): Promise<void>;
    /**Get an array of all PinguGuilds
     * @returns All PinguGuilds*/
    static GetGuilds(): Promise<PinguGuild[]>;
    constructor(guild: Guild, owner?: GuildMember);
    guildOwner: PGuildMember;
    clients: PClient[];
    members: Map<Snowflake, PinguGuildMember>;
    settings: PinguGuildSettings;
    joinedAt: Date;
}
export default PinguGuild;
