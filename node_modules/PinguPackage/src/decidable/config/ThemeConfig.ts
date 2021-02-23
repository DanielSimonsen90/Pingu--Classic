import { IThemeConfigOptions } from '../interfaces/IThemeConfigOptions';
import { PRole, PChannel } from '../../database/json';
import { Theme } from '../items/Theme';

export class ThemeConfig implements IThemeConfigOptions {
    constructor(options?: IThemeConfigOptions) {
        this.firstTimeExecuted = options ? options.firstTimeExecuted : true;
        this.allowSameWinner = options ? options.allowSameWinner : undefined;
        this.ignoreLastWins = options ? options.ignoreLastWins : 0;
        this.hostRole = options ? options.hostRole : undefined;
        this.winnerRole = options ? options.winnerRole : undefined;
        this.channel = options ? options.channel : undefined;
        this.themes = options ? options.themes : undefined;
    }

    public allowSameWinner: boolean;
    public ignoreLastWins: number;
    public hostRole: PRole;
    public winnerRole: PRole;
    public themes: Theme[];
    public channel: PChannel;
    public firstTimeExecuted: boolean;
}