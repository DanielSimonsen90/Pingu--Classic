import { IGiveawayConfigOptions } from '../interfaces/IGiveawayConfigOptions';
import { PRole, PChannel } from '../../database/json';
import { Giveaway } from '../items/Giveaway';
export declare class GiveawayConfig implements IGiveawayConfigOptions {
    constructor(options?: IGiveawayConfigOptions);
    allowSameWinner: boolean;
    hostRole: PRole;
    winnerRole: PRole;
    giveaways: Giveaway[];
    channel: PChannel;
    firstTimeExecuted: boolean;
}
