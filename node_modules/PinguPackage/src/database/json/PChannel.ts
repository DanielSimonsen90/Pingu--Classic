import { GuildChannel } from 'discord.js';
import { PItem } from './PItem';

export class PChannel extends PItem {
    constructor(channel: GuildChannel) {
        super(channel);
    }
}