import Marry from '../../pingu/user/items/Marry';
import PUser from './PUser';

export class PMarry {
    constructor(marry: Marry) {
        this.partner = marry.partner;
        this.internalDate = marry.internalDate.toString();
    }

    public partner: PUser
    public internalDate: string

    public ToMarry() {
        return new Marry(this.partner, this.internalDate);
    }
}

export default PMarry;