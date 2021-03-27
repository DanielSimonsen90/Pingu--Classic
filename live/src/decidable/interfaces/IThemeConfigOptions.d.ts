import { IDecidableConfigOptions } from './IDecidableConfigOptions';
import { PRole } from '../../database/json';
import { Theme } from '../items/Theme';
export interface IThemeConfigOptions extends IDecidableConfigOptions {
    allowSameWinner: boolean;
    ignoreLastWins: number;
    hostRole: PRole;
    winnerRole: PRole;
    themes: Theme[];
}
