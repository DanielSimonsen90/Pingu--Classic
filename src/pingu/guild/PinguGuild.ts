import { Client, Collection, Guild, GuildMember, Snowflake } from 'discord.js';

import { PItem, PClient, PGuildMember } from '../../database/json';
import { PinguGuildSettings } from './PinguGuildSettings';

import { SavedServers, errorLog, pGuildLog, DBExecute } from '../library/PinguLibrary';
const PinguLibrary = { SavedServers, errorLog, pGuildLog, DBExecute }

import { ToPinguClient } from '../client/PinguClient';
import { Error, Reason } from '../../helpers';
import { PinguGuildMember } from "../guildMember/PinguGuildMember";

//#region CRUD
import { PinguGuildSchema } from '../../MongoSchemas/PinguGuild';
export async function WritePGuild(client: Client, guild: Guild, scriptName: string, reason: string) {
    return PinguLibrary.DBExecute(client, async mongoose => {
        let pGuild = new PinguGuild(guild, !guild.owner ? guild.member(await client.users.fetch(guild.ownerID)) : null);
        let created = new PinguGuildSchema(pGuild).save();

        const log = new Reason('create', 'PinguGuild', pGuild.name, reason);
        PinguLibrary.pGuildLog(client, scriptName, (created ? log.succMsg : log.errMsg));
        
        cache.set(guild.id, pGuild);
        return pGuild;
    });
}
export async function GetPGuild(guild: Guild): Promise<PinguGuild> {
    if (!guild) return null;

    let pGuild = cache.get(guild.id);
    if (pGuild) return pGuild;

    let pGuildDoc = await PinguGuildSchema.findOne({ _id: guild.id as unknown }).exec();
    if (!pGuildDoc) return null;

    pGuild = pGuildDoc.toObject() as unknown as PinguGuild;
    cache.set(guild.id, pGuild);
    return pGuild;
}
type PinguGuildUpdate = 'name' | 'guildOwner' | 'clients' | 'members' | 'settings';
export async function UpdatePGuild(client: Client, updatedProperties: PinguGuildUpdate[], pGuild: PinguGuild, scriptName: string, reason: string) {
    let guild = await client.guilds.fetch(pGuild._id);
    if (!guild) throw new Error(`Guild not found!`);

    await PinguGuildSchema.updateOne({ _id: pGuild._id as unknown }, getUpdatedProperty(), null, async err => {
        const log = new Reason('update', 'PinguGuild', pGuild.name, reason);

        if (err) return PinguLibrary.pGuildLog(client, scriptName, log.errMsg, err);
        PinguLibrary.pGuildLog(client, scriptName, log.succMsg);
        
        cache.set(pGuild._id, await GetPGuild(client.guilds.cache.get(pGuild._id)))
    });
    return pGuild;

    function getUpdatedProperty() {
        interface IPinguGuildProps {
            name?: string,
            guildOwner?: PGuildMember,
            clients?: PClient[],
            members?: Map<Snowflake, PinguGuildMember>,
            settings?: PinguGuildSettings
        }
        const result = {} as IPinguGuildProps;
        for (const prop of updatedProperties) {
            switch (prop) {
                case 'name': result.name = pGuild.name; break;
                case 'guildOwner': result.guildOwner = pGuild.guildOwner;  break;
                case 'clients': result.clients = pGuild.clients;  break;
                case 'members': result.members = pGuild.members;  break;
                case 'settings': result.settings = pGuild.settings;  break;
                default: throw new Error(`${prop} is not a recognized property!`);
            }
        }
        return result;
    }
}
export async function DeletePGuild(client: Client, guild: Guild, scriptName: string, reason: string) {
    await PinguGuildSchema.deleteOne({ _id: guild.id }, null, err => {
        const log = new Reason('delete', 'PinguGuild', guild.name, reason);

        if (err) return PinguLibrary.pGuildLog(client, scriptName, log.errMsg, new Error(err));
        else PinguLibrary.pGuildLog(client, scriptName, log.succMsg);

        cache.delete(guild.id);
    });
    return;
}
export async function GetPinguGuilds(): Promise<PinguGuild[]> {
    return (await PinguGuildSchema.find({}).exec()).map(collDoc => collDoc.toObject())  as unknown  as PinguGuild[];
}
//#endregion

export const cache = new Collection<string, PinguGuild>();

export class PinguGuild extends PItem {
    //#region Statics
    /**Creates and saves Guild as a PinguGuild and returns the new PinguGuild object
     * @param client Client that called the method
     * @param guild Guild to create a PinguGuild for
     * @param scriptName Script that called the write method
     * @param reason Reason for creating a new PinguGuild
     * @returns Guild converted to PinguGuild*/
    public static async Write(client: Client, guild: Guild, scriptName: string, reason: string) { return WritePGuild(client, guild, scriptName, reason); }
    /**Get PinguGuild from Guild
     * @param guild Guild to get the PinguGuild for
     * @returns The Guild converted to PinguGuild*/
    public static async Get(guild: Guild): Promise<PinguGuild> { return GetPGuild(guild); }
    /**Updates specified PinguGuild to the database
     * @param client Client that called the method
     * @param updatedProperties List of property names that are being updated
     * @param pGuild Pingu Guild object that is being updated
     * @param scriptName Script that called the method
     * @param reason Reason for updating the PinguGuild
     * @returns The updated PinguGuild*/
    public static async Update(client: Client, updatedProperties: PinguGuildUpdate[], pGuild: PinguGuild, scriptName: string, reason: string) { return UpdatePGuild(client, updatedProperties, pGuild, scriptName, reason); }
    /**Deletes the guild from the PinguGuild database
     * @param client Client that called the method
     * @param guild Guild to be deleted
     * @param scriptName Script that called the method
     * @param reason Reason for deleting the PinguGuild
     * @returns what should it return?*/
    public static async Delete(client: Client, guild: Guild, scriptName: string, reason: string): Promise<void> { return DeletePGuild(client, guild, scriptName, reason); }
    /**Get an array of all PinguGuilds
     * @returns All PinguGuilds*/
    public static async GetGuilds(): Promise<PinguGuild[]> { return GetPinguGuilds(); }
    //#endregion

    constructor(guild: Guild, owner?: GuildMember) {
        super(guild);

        if (guild.owner) this.guildOwner = new PGuildMember(guild.owner);
        else if (owner) this.guildOwner = new PGuildMember(owner);
        else PinguLibrary.errorLog(guild.client, `Owner wasn't set when making Pingu Guild for "${guild.name}".`);

        this.clients = new Array<PClient>();
        let clientIndex = ToPinguClient(guild.client).isLive ? 0 : 1;
        if (clientIndex != 0) this.clients.push(null);
        this.clients[clientIndex] = new PClient(guild.client, guild);

        this.settings = new PinguGuildSettings(guild);
        this.members = new Map<Snowflake, PinguGuildMember>();
    }
    public guildOwner: PGuildMember
    public clients: PClient[]
    public members: Map<Snowflake, PinguGuildMember>;
    public settings: PinguGuildSettings;
}