import Marry from '../../pingu/user/items/Marry';
import PUser from './PUser';
export declare class PMarry {
    constructor(marry: Marry);
    partner: PUser;
    internalDate: string;
    ToMarry(): Marry;
}
export default PMarry;
