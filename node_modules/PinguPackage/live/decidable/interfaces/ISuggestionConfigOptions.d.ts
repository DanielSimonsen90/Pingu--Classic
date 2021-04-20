import { IDecidableConfigOptions } from './IDecidableConfigOptions';
import { Suggestion } from '../items/Suggestion';
import { PRole } from '../../database/json';
export interface ISuggestionConfigOptions extends IDecidableConfigOptions {
    managerRole: PRole;
    suggestions: Suggestion[];
}
