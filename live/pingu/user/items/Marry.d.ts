import { User } from "discord.js";
import { PUser } from "../../../database/json/PUser";
export declare class Marry {
    constructor(partner?: PUser, internalDate?: string);
    partner: PUser;
    internalDate: Date;
    marriedMessage(): string;
    marry(partner: User): void;
    divorce(): void;
}
