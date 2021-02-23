import { ISuggestionConfigOptions } from '../interfaces/ISuggestionConfigOptions';
import { PRole, PChannel } from '../../database/json';
import { Suggestion } from '../items/Suggestion';
export declare class SuggestionConfig implements ISuggestionConfigOptions {
    constructor(options?: ISuggestionConfigOptions);
    managerRole: PRole;
    suggestions: Suggestion[];
    channel: PChannel;
    firstTimeExecuted: boolean;
}
