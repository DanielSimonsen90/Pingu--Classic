import { Client, Collection, Guild, GuildMember, Snowflake } from 'discord.js';

import { PItem, PClient, PGuildMember } from '../../database/json';
import { PinguGuildSettings } from './PinguGuildSettings';

import { SavedServers, errorLog, pGuildLog, DBExecute } from '../library/PinguLibrary';

const PinguLibrary = { SavedServers, errorLog, pGuildLog, DBExecute }

import { ToPinguClient } from '../client/PinguClient';
import { Error } from '../../helpers';
import { PinguGuildMember } from "../guildMember/PinguGuildMember";

//#region CRUD
import { PinguGuildSchema } from '../../MongoSchemas/PinguGuild';
export async function WritePGuild(client: Client, guild: Guild, scriptName: string, succMsg: string, errMsg: string) {
    PinguLibrary.DBExecute(client, async mongoose => {
        let created = new PinguGuildSchema(new PinguGuild(guild, !guild.owner ? guild.member(await client.users.fetch(guild.ownerID)) : null));
        if (!created) return PinguLibrary.pGuildLog(client, scriptName, errMsg);

        created.save();
        return PinguLibrary.pGuildLog(client, scriptName, succMsg);
    });
}
export async function GetPGuild(guild: Guild): Promise<PinguGuild> {
    if (!guild) return null;
    let pGuildDoc = await PinguGuildSchema.findOne({ _id: guild.id }).exec();
    if (!pGuildDoc) return null;
    cache.set(guild.id, pGuildDoc.toObject());
    return pGuildDoc.toObject();
}
export async function UpdatePGuild(client: Client, updatedProperty: object, pGuild: PinguGuild, scriptName: string, succMsg: string, errMsg: string) {
    let guild = await client.guilds.fetch(pGuild._id);
    if (!guild) throw new Error(`Guild not found!`);

    return await PinguGuildSchema.updateOne({ _id: pGuild._id }, updatedProperty, null, async err => {
        if (err) return PinguLibrary.pGuildLog(client, scriptName, errMsg, err);
        PinguLibrary.pGuildLog(client, scriptName, succMsg);
        
        cache.set(pGuild._id, await GetPGuild(client.guilds.cache.get(pGuild._id)))
    });
}
export async function DeletePGuild(client: Client, guild: Guild, scriptName: string, succMsg: string, errMsg: string): Promise<PinguGuild> {
    return await PinguGuildSchema.deleteOne({ _id: guild.id }, null, err => {
        if (err) PinguLibrary.pGuildLog(client, scriptName, errMsg, new Error(err));
        else PinguLibrary.pGuildLog(client, scriptName, succMsg);
    });
}
export async function GetPGuilds(): Promise<PinguGuild[]> {
    return (await PinguGuildSchema.find({}).exec()).map(collDoc => collDoc.toObject());
}
//#endregion

export const cache = new Collection<string, PinguGuild>();

export class PinguGuild extends PItem {
    //#region Statics
    public static async WritePGuild(client: Client, guild: Guild, scriptName: string, succMsg: string, errMsg: string) { return WritePGuild(client, guild, scriptName, succMsg, errMsg); }
    public static async GetPGuild(guild: Guild): Promise<PinguGuild> { return GetPGuild(guild); }
    public static async UpdatePGuild(client: Client, updatedProperty: object, pGuild: PinguGuild, scriptName: string, succMsg: string, errMsg: string)
    { return UpdatePGuild(client, updatedProperty, pGuild, scriptName, succMsg, errMsg); }
    public static async DeletePGuild(client: Client, guild: Guild, scriptName: string, succMsg: string, errMsg: string): Promise<PinguGuild>
    { return DeletePGuild(client, guild, scriptName, succMsg, errMsg); }
    public static async GetPGuilds(): Promise<PinguGuild[]> { return GetPGuilds(); }
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

        guild.members.cache.array().forEach(gm => this.members.set(gm.id, new PinguGuildMember(gm, this.settings.config.achievements.notificationTypes.members)));
    }
    public guildOwner: PGuildMember
    public clients: PClient[]
    public members: Map<Snowflake, PinguGuildMember>;
    public settings: PinguGuildSettings;
}