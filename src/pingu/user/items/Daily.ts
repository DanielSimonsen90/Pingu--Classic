import TimeSpan from "../../../helpers/TimeSpan";

export class Daily {
    constructor() {
        this.lastClaim = null;
        this.nextClaim = null;
        this.streak = 0;
    }

    public lastClaim: Date
    public nextClaim: TimeSpan
    public streak: number
}

export default Daily;