import PChannel from '../../database/json/PChannel';

export interface IDecidableConfigOptions {
    channel: PChannel;
    firstTimeExecuted: boolean;
}

export default IDecidableConfigOptions;