export { PChannel, PClient, PGuild, PGuildMember, PItem, PMarry, PQueue, PRole, PUser } from './json';
import { Client } from 'discord.js';
export declare function DBExecute(client: Client, callback: (mongoose: typeof import('mongoose')) => void): Promise<void>;
