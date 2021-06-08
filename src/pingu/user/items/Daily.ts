import TimeLeftObject from "../../../helpers/TimeLeftObject";

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

export default Daily;