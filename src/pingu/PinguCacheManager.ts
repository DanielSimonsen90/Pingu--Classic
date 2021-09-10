import { Collection, Message, MessageEmbed } from "discord.js";
import { LoggedCache } from './handlers/Pingu/PinguEvent';

export class PinguCacheManager {
    constructor() {
        this.events = LoggedCache
    }

    public errors = new Collection<number, Message[]>();
    public events = new Array<MessageEmbed>();

    public clear() {
        this.errors.clear();
        this.events = new Array();
        return this;
    }
}

export default PinguCacheManager;