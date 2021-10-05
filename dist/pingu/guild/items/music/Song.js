"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Song = void 0;
const PUser_1 = require("../../../../database/json/PUser");
const TimeSpan_1 = require("../../../../helpers/TimeSpan");
class Song {
    constructor(author, songInfo) {
        //YouTube
        this.link = songInfo.video_url;
        this.title = songInfo.title;
        this.author = songInfo.author && songInfo.author.name;
        this.length = this.GetLength(songInfo.lengthSeconds);
        this.lengthMS = parseInt(songInfo.lengthSeconds) * 1000;
        this.thumbnail = songInfo.thumbnail.thumbnails[0].url;
        this.requestedBy = new PUser_1.default(author);
        this._id = 0;
        this.volume = -1;
        this.loop = false;
        this.endsAt = null;
    }
    _id;
    title;
    link;
    author;
    thumbnail;
    length;
    lengthMS;
    volume;
    playing;
    loop;
    endsAt;
    requestedBy;
    play() {
        this.endsAt = new Date(Date.now() + this.lengthMS);
    }
    stop() {
        this.endsAt = null;
    }
    getTimeLeft() {
        return new TimeSpan_1.default(new Date(Date.now()), this.endsAt);
    }
    GetLength(secondsLength) {
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
exports.Song = Song;
exports.default = Song;
