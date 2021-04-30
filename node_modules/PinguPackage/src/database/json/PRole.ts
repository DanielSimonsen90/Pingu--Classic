import { Role } from 'discord.js';
import PItem from './PItem';

export class PRole extends PItem {
    constructor(role: Role) {
        super(role);
    }
}

export default PRole;