import { User } from "discord.js";
import { MoreVideoDetails } from "ytdl-core";

import PUser from "../../../../database/json/PUser";
import TimeLeftObject from "../../../../helpers/TimeLeftObject";
import IMuisc from "./IMusic";

export class Song implements IMuisc {
    constructor(author: User, songInfo: MoreVideoDetails) {
        //YouTube
        this.link = songInfo.video_url;
        this.title = songInfo.title;
        this.author = songInfo.author && songInfo.author.name;
        this.length = this.GetLength(songInfo.lengthSeconds);
        this.lengthMS = parseInt(songInfo.lengthSeconds) * 1000;
        this.thumbnail = songInfo.thumbnail.thumbnails[0].url;

        this.requestedBy = new PUser(author);
        this._id = 0;
        this.volume = -1;
        this.loop = false;
        this.endsAt = null;
    }
    public _id: number
    public title: string
    public link: string
    public author: string
    public thumbnail: string
    public length: string
    public lengthMS: number
    public volume: number
    public playing: boolean
    public loop: boolean
    public endsAt: Date
    public requestedBy: PUser

    public play() {
        this.endsAt = new Date(Date.now() + this.lengthMS);
    }
    public stop() {
        this.endsAt = null;
    }
    public getTimeLeft() {
        return new TimeLeftObject(new Date(Date.now()), this.endsAt);
    }
    private GetLength(secondsLength: string) {
        var seconds = parseInt(secondsLength), minutes = 0, hours = 0, final = [];

        if (seconds > 59) {
            while (seconds > 59) {
                seconds -= 60;
                minutes++;
            }
        }
        if (minutes > 59) {
            while (minutes > 59) {
                minutes -= 60;
                hours++;
            }
        }

        final.push(hours, minutes, seconds);

        return final.map(i => i < 10 ? `0${i}` : i).join('.');
    }
}

export default Song;