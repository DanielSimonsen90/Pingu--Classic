import { Guild } from 'discord.js';
import PItem from './Pitem';

export class PGuild extends PItem {
    constructor(guild: Guild) {
        super(guild);
    }
}

export default PGuild;