"use strict";
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
    _model;
    async add(item, scriptName, reason) {
        return this._client.DBExecute(async (mongoose) => {
            const pItem = this._newPT(item, this._client);
            const created = await new this._model(pItem).save();
            const _reason = new Reason_1.default('create', this._itemName, pItem.name || pItem.tag, reason);
            this.log(scriptName, _reason, created ? null : new Error_1.default(`Unable to create ${this._itemName}`));
            this._inner.set(item.id, pItem);
            return pItem;
        });
    }
    async fetch(item, scriptName, reason) {
        if (!item)
            return null;
        const pItemDoc = await this._model.findOne({ _id: item.id }).exec();
        if (!pItemDoc)
            return null;
        const pItem = pItemDoc.toObject();
        this._inner.set(item.id, pItem);
        this.log(scriptName, new Reason_1.default('fetch', this._itemName, item.name || item.tag, reason));
        return pItem;
    }
    async update(pItem, scriptName, reason) {
        const item = await this._typeManager(this._client, pItem).fetch(pItem._id);
        if (!item)
            throw new Error_1.default(`${this._itemName} not found!`);
        await this._model.updateOne({ _id: pItem._id }, pItem, null, async (err) => {
            const _reason = new Reason_1.default('update', this._itemName, pItem.name || pItem.tag, reason);
            if (err)
                return this.log(scriptName, _reason, err);
            this.log(scriptName, _reason);
            this._inner.set(pItem._id, pItem);
        });
        return pItem;
    }
    async delete(item, scriptName, reason) {
        await this._model.deleteOne({ _id: item.id }, null, err => {
            const _reason = new Reason_1.default('delete', this._itemName, item.name || item.tag, reason);
            if (err)
                return this.log(scriptName, _reason, err);
            this.log(scriptName, _reason);
            this._inner.delete(item.id);
        });
        return this;
    }
    async refresh(client) {
        if (client)
            this._client = client;
        const collDocs = await this._client.DBExecute(async () => this._model.find({}));
        const dbEntries = collDocs.map(collDoc => collDoc.toObject());
        this._inner = new discord_js_1.Collection(dbEntries.map(entry => [entry._id, entry]));
        this._client.log('console', `Successfully refreshed entries for **${this._itemName}**.`);
        return this;
    }
}
exports.PinguCollection = PinguCollection;
exports.default = PinguCollection;