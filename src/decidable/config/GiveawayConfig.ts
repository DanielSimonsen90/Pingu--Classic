import IGiveawayConfigOptions from '../interfaces/IGiveawayConfigOptions';
import { PRole, PChannel } from '../../database/json';
import Giveaway from '../items/Giveaway';

export class GiveawayConfig implements IGiveawayConfigOptions {
    constructor(options?: IGiveawayConfigOptions) {
        this.firstTimeExecuted = options ? options.firstTimeExecuted : true;
        this.allowSameWinner = options ? options.allowSameWinner : undefined;
        this.hostRole = options ? options.hostRole : undefined;
        this.winnerRole = options ? options.winnerRole : undefined;
        this.channel = options ? options.channel : undefined;
        this.giveaways = options ? options.giveaways : undefined;
    }
    public allowSameWinner: boolean;
    public hostRole: PRole;
    public winnerRole: PRole;
    public giveaways: Giveaway[];
    public channel: PChannel;
    public firstTimeExecuted: boolean;
}

export default GiveawayConfig;