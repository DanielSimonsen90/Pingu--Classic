import ISuggestionConfigOptions from '../interfaces/ISuggestionConfigOptions';
import { PRole, PChannel } from '../../database/json';
import Suggestion from '../items/Suggestion';

export class SuggestionConfig implements ISuggestionConfigOptions {
    constructor(options?: ISuggestionConfigOptions) {
        this.firstTimeExecuted = options ? options.firstTimeExecuted : true;
        this.managerRole = options ? options.managerRole : undefined;
        this.channel = options ? options.channel : undefined;
        this.suggestions = options ? options.suggestions : undefined;
    }

    public managerRole: PRole;
    public suggestions: Suggestion[];
    public channel: PChannel;
    public firstTimeExecuted: boolean;
}

export default SuggestionConfig;