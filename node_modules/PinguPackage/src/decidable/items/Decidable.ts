import { GuildChannel } from 'discord.js';
import { PGuildMember, PChannel } from '../../database/json'

export class Decidable {
    constructor(value: string, id: string, author: PGuildMember, channel: GuildChannel, endsAt: Date) {
        this.value = value;
        this._id = id;
        this.author = author;
        this.channel = new PChannel(channel);
        this.endsAt = endsAt;
    }
    public value: string
    public _id: string
    public author: PGuildMember
    public channel: PChannel
    public endsAt: Date
}