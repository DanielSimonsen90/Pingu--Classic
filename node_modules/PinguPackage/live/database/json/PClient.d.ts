import { Client, Guild } from 'discord.js';
export declare class PClient {
    constructor(client: Client, guild: Guild);
    displayName: string;
    embedColor: number;
    prefix: string;
    _id: string;
}
