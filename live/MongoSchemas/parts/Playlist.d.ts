export declare const Playlist: {
    name: StringConstructor;
    songs: {
        _id: NumberConstructor;
        title: StringConstructor;
        link: StringConstructor;
        author: StringConstructor;
        thumbnail: StringConstructor;
        length: StringConstructor;
        lengthMS: NumberConstructor;
        volume: NumberConstructor;
        playing: BooleanConstructor;
        loop: BooleanConstructor;
        endsAt: DateConstructor;
        requestedBy: {
            _id: StringConstructor;
            name: StringConstructor;
        };
    }[];
};
export default Playlist;
