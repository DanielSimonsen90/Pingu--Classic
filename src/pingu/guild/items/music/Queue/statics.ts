import { Collection } from 'discord.js';
import Queue from './Queue';

const GuildQueue = new Collection<string, Queue>();
export function get(guildID: string) {
    return GuildQueue.get(guildID);
}
export function set(guildID: string, queue: Queue) {
    GuildQueue.set(guildID, queue);
}