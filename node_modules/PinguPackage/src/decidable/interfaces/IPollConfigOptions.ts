import IDecidableConfigOptions from './IDecidableConfigOptions';
import PRole from '../../database/json/PRole';
import Poll from '../items/Poll';

export interface IPollConfigOptions extends IDecidableConfigOptions {
    pollRole: PRole;
    polls: Poll[];
}

export default IPollConfigOptions;