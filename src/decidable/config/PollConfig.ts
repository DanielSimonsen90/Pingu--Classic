import IPollConfigOptions from '../interfaces/IPollConfigOptions';
import { PRole, PChannel } from '../../database/json';
import Poll from '../items/Poll';

export class PollConfig implements IPollConfigOptions {
    constructor(options?: IPollConfigOptions) {
        this.firstTimeExecuted = options ? options.firstTimeExecuted : true;
        this.pollRole = options ? options.pollRole : undefined;
        this.channel = options ? options.channel : undefined;
        this.polls = options ? options.polls : undefined;
    }
    public firstTimeExecuted: boolean
    public pollRole: PRole;
    public polls: Poll[];
    public channel: PChannel;
}

export default PollConfig;