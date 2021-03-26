import { IDecidableConfigOptions } from './IDecidableConfigOptions';
import { PRole } from '../../database/json';
import { Poll } from '../items/Poll';

export interface IPollConfigOptions extends IDecidableConfigOptions {
    pollRole: PRole;
    polls: Poll[];
}