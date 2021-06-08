import { GuildMember } from 'discord.js';
import PItem from './PItem';

export class PGuildMember extends PItem {
    constructor(member: GuildMember) {
        super({
            id: member.id,
            name: member.user.tag
        });
    }
}

export default PGuildMember;