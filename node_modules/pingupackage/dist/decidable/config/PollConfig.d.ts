import IPollConfigOptions from '../interfaces/IPollConfigOptions';
import { PRole, PChannel } from '../../database/json';
import Poll from '../items/Poll';
export declare class PollConfig implements IPollConfigOptions {
    constructor(options?: IPollConfigOptions);
    firstTimeExecuted: boolean;
    pollRole: PRole;
    polls: Poll[];
    channel: PChannel;
}
export default PollConfig;
