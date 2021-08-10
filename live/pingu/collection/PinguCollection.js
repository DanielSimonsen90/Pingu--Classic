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
exports.PinguCollection = void 0;
const discord_js_1 = require("discord.js");
const Reason_1 = require("../../helpers/Reason");
const Error_1 = require("../..//helpers/Error");
const IPinguCollection_1 = require("./IPinguCollection");
class PinguCollection extends IPinguCollection_1.default {
    constructor(client, logChannelName, itemName, newPT, typeManager) {
        super(client, logChannelName, itemName, newPT, typeManager);
        this._model = require(`../../MongoSchemas/${itemName}`).default;
    }
    add(item, scriptName, reason) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._client.DBExecute((mongoose) => __awaiter(this, void 0, void 0, function* () {
                const pItem = this._newPT(item, this._client);
                const created = yield new this._model(pItem).save();
                const _reason = new Reason_1.default('create', this._itemName, pItem.name || pItem.tag, reason);
                this.log(scriptName, _reason, created ? null : new Error_1.default(`Unable to create ${this._itemName}`));
                this._inner.set(item.id, pItem);
                return pItem;
            }));
        });
    }
    fetch(item, scriptName, reason) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!item)
                return null;
            const pItemDoc = yield this._model.findOne({ _id: item.id }).exec();
            if (!pItemDoc)
                return null;
            const pItem = pItemDoc.toObject();
            this._inner.set(item.id, pItem);
            this.log(scriptName, new Reason_1.default('fetch', this._itemName, item.name || item.tag, reason));
            return pItem;
        });
    }
    update(pItem, scriptName, reason) {
        return __awaiter(this, void 0, void 0, function* () {
            const item = yield this._typeManager(this._client, pItem).fetch(pItem._id);
            if (!item)
                throw new Error_1.default(`${this._itemName} not found!`);
            yield this._model.updateOne({ _id: pItem._id }, pItem, null, (err) => __awaiter(this, void 0, void 0, function* () {
                const _reason = new Reason_1.default('update', this._itemName, pItem.name || pItem.tag, reason);
                if (err)
                    return this.log(scriptName, _reason, err);
                this.log(scriptName, _reason);
                this._inner.set(pItem._id, pItem);
            }));
            return pItem;
        });
    }
    delete(item, scriptName, reason) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._model.deleteOne({ _id: item.id }, null, err => {
                const _reason = new Reason_1.default('delete', this._itemName, item.name || item.tag, reason);
                if (err)
                    return this.log(scriptName, _reason, err);
                this.log(scriptName, _reason);
                this._inner.delete(item.id);
            });
            return this;
        });
    }
    refresh(client) {
        return __awaiter(this, void 0, void 0, function* () {
            if (client)
                this._client = client;
            const collDocs = yield this._client.DBExecute(() => __awaiter(this, void 0, void 0, function* () { return this._model.find({}); }));
            const dbEntries = collDocs.map(collDoc => collDoc.toObject());
            this._inner = new discord_js_1.Collection(dbEntries.map(entry => [entry._id, entry]));
            this._client.log('console', `Successfully refreshed entries for **${this._itemName}**.`);
            return this;
        });
    }
}
exports.PinguCollection = PinguCollection;
exports.default = PinguCollection;
