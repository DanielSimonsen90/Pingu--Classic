import PItem from "./PItem";

export const Song = {
    _id: Number,
    title: String,
    link: String,
    author: String,
    thumbnail: String,
    length: String,
    lengthMS: Number,
    volume: Number,
    playing: Boolean,
    loop: Boolean,
    endsAt: Date,
    requestedBy: PItem
};

export default Song;