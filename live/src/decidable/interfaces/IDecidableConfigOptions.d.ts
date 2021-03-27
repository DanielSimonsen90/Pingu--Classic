import { PChannel } from '../../database/json';
export interface IDecidableConfigOptions {
    channel: PChannel;
    firstTimeExecuted: boolean;
}
