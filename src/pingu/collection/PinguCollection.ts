import { Collection } from 'discord.js';
import { Model, Document, Query } from 'mongoose';

import PinguClientBase from '../client/PinguClientBase';
import Reason from '../../helpers/Reason'
import Error from '../..//helpers/Error';
import IPinguCollection, { BaseT, BasePT, SavedItems, BaseManager } from './IPinguCollection'

type ModelType<PT> = Model<Document<PT>>

export class PinguCollection<T extends BaseT, PT extends BasePT> extends IPinguCollection<T, PT> {
    constructor(
        client: PinguClientBase, logChannelName: string, itemName: SavedItems, 
        newPT: (item: T, client: PinguClientBase) => PT, typeManager: (client: PinguClientBase, pItem: PT) => BaseManager<T>
    ) {
        super(client, logChannelName, itemName, newPT, typeManager);
        this._model = require(`../../MongoSchemas/${itemName}`).default as ModelType<PT>;
    }

    private _model: ModelType<PT>

    public async add(item: T, scriptName: string, reason: string): Promise<PT> {
        return this._client.DBExecute(async mongoose => {
            const pItem = this._newPT(item, this._client);
            const created = await (new this._model(pItem)).save();

            const _reason = new Reason('create', this._itemName as any, pItem.name || pItem.tag, reason);
            this.log(scriptName, _reason, created ? null : new Error(`Unable to create ${this._itemName}`));

            this._inner.set(item.id, pItem);
            return pItem;
        });
    }
    public async fetch(item: T, scriptName: string, reason: string): Promise<PT> {
        if (!item) return null;

        const pItemDoc = await this._model.findOne({ _id: item.id as any }).exec();
        if (!pItemDoc) return null;

        const pItem = pItemDoc.toObject() as unknown as PT;
        this._inner.set(item.id, pItem);

        this.log(scriptName, new Reason('fetch', this._itemName as any, item.name || item.tag, reason))
        
        return pItem;
    }
    public async update(pItem: PT, scriptName: string, reason: string): Promise<PT> {
        const item = await this._typeManager(this._client, pItem).fetch(pItem._id);
        if (!item) throw new Error(`${this._itemName} not found!`);

        await this._model.updateOne({ _id: pItem._id as any }, pItem as any, null, async err => {
            const _reason = new Reason('update', this._itemName as any, pItem.name || pItem.tag, reason);

            if (err) return this.log(scriptName, _reason, err);
            this.log(scriptName, _reason);

            this._inner.set(pItem._id, pItem);
        });
        return pItem;
    }
    public async delete(item: T, scriptName: string, reason: string): Promise<this> {
        await this._model.deleteOne({ _id: item.id as any }, null, err => {
            const _reason = new Reason('delete', this._itemName as any, item.name || item.tag, reason);

            if (err) return this.log(scriptName, _reason, err);
            this.log(scriptName, _reason);

            this._inner.delete(item.id);
        });
        return this;
    }

    public async refresh(client?: PinguClientBase): Promise<this> {
        if (client) this._client = client;

        const collDocs = await this._client.DBExecute<Document<PT>[]>(async () => this._model.find({}))
        const dbEntries = collDocs.map(collDoc => collDoc.toObject() as any as PT);

        this._inner = new Collection(dbEntries.map(entry => [entry._id, entry]));
        this._client.log('console', `Successfully refreshed entries for **${this._itemName}**.`);
        
        return this;
    }
}

export default PinguCollection;