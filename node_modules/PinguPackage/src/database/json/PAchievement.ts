export class PAchievement {
    constructor(data: {_id: string, achievedAt: Date}) {
        this._id = data._id;
        this.achievedAt = data.achievedAt;
    }

    public _id: string;
    public achievedAt: Date;
}