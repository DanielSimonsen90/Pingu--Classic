import { User } from "discord.js";
import { MoreVideoDetails } from "ytdl-core";
import PUser from "../../../../database/json/PUser";
import TimeSpan from "../../../../helpers/TimeSpan";
import IMuisc from "./IMusic";
export declare class Song implements IMuisc {
    constructor(author: User, songInfo: MoreVideoDetails);
    _id: number;
    title: string;
    link: string;
    author: string;
    thumbnail: string;
    length: string;
    lengthMS: number;
    volume: number;
    playing: boolean;
    loop: boolean;
    endsAt: Date;
    requestedBy: PUser;
    play(): void;
    stop(): void;
    getTimeLeft(): TimeSpan;
    private GetLength;
}
export default Song;
