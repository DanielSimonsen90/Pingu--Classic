import { Guild } from 'discord.js';
import PItem from './PItem';

export class PGuild extends PItem {
    constructor(guild: Guild) {
        super(guild);
    }
}

export default PGuild;