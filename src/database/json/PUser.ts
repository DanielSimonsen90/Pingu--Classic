import { User } from 'discord.js';
import PItem from './PItem';

export class PUser extends PItem {
    constructor(user: User) {
        super({ id: user.id, name: user.tag });
    }
}

export default PUser;