import { TimeLeftObject } from "../../../helpers";

export class Daily {
    constructor() {
        this.lastClaim = null;
        this.nextClaim = null;
        this.streak = 0;
    }

    public lastClaim: Date
    public nextClaim: TimeLeftObject
    public streak: number
}