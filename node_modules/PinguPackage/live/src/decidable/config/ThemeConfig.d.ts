import { IThemeConfigOptions } from '../interfaces/IThemeConfigOptions';
import { PRole, PChannel } from '../../database/json';
import { Theme } from '../items/Theme';
export declare class ThemeConfig implements IThemeConfigOptions {
    constructor(options?: IThemeConfigOptions);
    allowSameWinner: boolean;
    ignoreLastWins: number;
    hostRole: PRole;
    winnerRole: PRole;
    themes: Theme[];
    channel: PChannel;
    firstTimeExecuted: boolean;
}
