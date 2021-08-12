import { Guild, GuildMember, Snowflake } from 'discord.js';

import { PItem, PClient, PGuildMember } from '../../database/json';
import PinguGuildSettings from './PinguGuildSettings';

import { ToBasePinguClient } from '../client/BasePinguClient';
import PinguGuildMember from "../guildMember/PinguGuildMember";

export class PinguGuild extends PItem {
    constructor(guild: Guild, owner?: GuildMember) {
        super(guild);
        const client = ToBasePinguClient(guild.client);

        if (guild.owner) this.guildOwner = new PGuildMember(guild.owner());
        else if (owner) this.guildOwner = new PGuildMember(owner);
        else client.log('error', `Owner wasn't set when making Pingu Guild for "${guild.name}".`);

        this.clients = new Array<PClient>();
        let clientIndex = client.isLive ? 0 : 1;
        if (clientIndex != 0) this.clients.push(null);
        this.clients[clientIndex] = new PClient(client, guild);

        this.settings = new PinguGuildSettings(guild);
        this.members = new Map<Snowflake, PinguGuildMember>();
        this.joinedAt = new Date();
    }
    public guildOwner: PGuildMember
    public clients: PClient[]
    public members: Map<Snowflake, PinguGuildMember>;
    public settings: PinguGuildSettings;
    public joinedAt: Date;
}

export default PinguGuild;