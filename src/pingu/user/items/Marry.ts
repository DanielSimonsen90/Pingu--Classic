import { User } from "discord.js";
import PUser from "../../../database/json/PUser";

export class Marry {
    constructor(partner?: PUser, internalDate?: string) {
        this.partner = partner;
        this.internalDate = internalDate ? new Date(internalDate) : null;
    }

    public partner: PUser
    public internalDate: Date
    public marriedMessage(): string {
        return `You have been ${(this.partner ? `married to <@${this.partner._id}> for` : `single for`)} <t:${Math.round(this.internalDate.getTime() / 1000)}:R>`;
    }

    public marry(partner: User) {
        this.internalDate = new Date(Date.now());
        this.partner = new PUser(partner);
    }
    public divorce() {
        this.internalDate = new Date(Date.now());
        this.partner = null;
    }
}

export default Marry;