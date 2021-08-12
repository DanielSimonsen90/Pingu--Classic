"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Decidable = void 0;
const json_1 = require("../../database/json");
class Decidable {
    constructor(value, id, author, channel, endsAt) {
        this.value = value;
        this._id = id;
        this.author = author;
        this.channel = new json_1.PChannel(channel);
        this.endsAt = endsAt;
    }
    value;
    _id;
    author;
    channel;
    endsAt;
}
exports.Decidable = Decidable;
exports.default = Decidable;
