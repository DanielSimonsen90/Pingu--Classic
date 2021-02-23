import { IDecidableConfigOptions } from './IDecidableConfigOptions';
import { PRole } from '../../database';
import { Giveaway } from '../items';

export interface IGiveawayConfigOptions extends IDecidableConfigOptions {
    allowSameWinner: boolean;
    hostRole: PRole;
    winnerRole: PRole;
    giveaways: Giveaway[];
}