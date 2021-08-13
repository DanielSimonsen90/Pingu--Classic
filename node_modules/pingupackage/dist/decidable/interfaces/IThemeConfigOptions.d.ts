import IDecidableConfigOptions from './IDecidableConfigOptions';
import PRole from '../../database/json/PRole';
import Theme from '../items/Theme';
export interface IThemeConfigOptions extends IDecidableConfigOptions {
    allowSameWinner: boolean;
    ignoreLastWins: number;
    hostRole: PRole;
    winnerRole: PRole;
    themes: Theme[];
}
export default IThemeConfigOptions;
