export { PAchievement, PChannel, PClient, PGuild, PGuildMember, PItem, PMarry, PQueue, PRole, PUser } from './json';
import { Client } from 'discord.js';
export declare function DBExecute<T>(client: Client, callback: (mongoose: typeof import('mongoose')) => Promise<T>): Promise<T>;
