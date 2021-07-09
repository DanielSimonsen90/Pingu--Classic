"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PinguMusicEvent = exports.HandleEvent = void 0;
const PinguLibrary_1 = require("../library/PinguLibrary");
function HandleEvent(caller, client, path, ...args) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            var event = require(`../../../../..${path}`);
        }
        catch (err) {
            console.log({ err, caller, path });
            return PinguLibrary_1.errorLog(client, `Unable to get event for ${caller}`, null, err, {
                params: { caller, path, args },
                additional: { event }
            });
        }
        if (!event || !event.execute)
            return;
        function execute() {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    return event.execute(client, ...args);
                }
                catch (err) {
                    PinguLibrary_1.errorLog(client, `${event.name}.execute`, null, err, {
                        params: { caller, path, args },
                        additional: { event }
                    });
                }
            });
        }
        yield execute().catch(err => {
            return PinguLibrary_1.errorLog(client, err.message, JSON.stringify(args, null, 2), err, {
                params: { caller, path, args },
                additional: { event }
            });
        });
    });
}
exports.HandleEvent = HandleEvent;
const PinguHandler_1 = require("./PinguHandler");
class PinguMusicEvent extends PinguHandler_1.default {
    constructor(name, execute) {
        super(name);
        this.execute = execute;
    }
    static HandleEvent(caller, client, path, ...args) {
        return HandleEvent(caller, client, path, ...args);
    }
    execute(client, ...args) {
        return __awaiter(this, void 0, void 0, function* () { return null; });
    }
}
exports.PinguMusicEvent = PinguMusicEvent;
exports.default = PinguMusicEvent;
