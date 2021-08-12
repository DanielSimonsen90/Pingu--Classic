import { Guild } from 'discord.js';
export declare class PClient {
    constructor(guild: Guild);
    displayName: string;
    embedColor: number;
    prefix: string;
    _id: string;
}
export default PClient;
