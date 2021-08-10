import BasePinguClient from '../client/BasePinguClient';
import IPinguCollection, { BaseT, BasePT, SavedItems, BaseManager } from './IPinguCollection';
export declare class PinguCollection<T extends BaseT, PT extends BasePT> extends IPinguCollection<T, PT> {
    constructor(client: BasePinguClient, logChannelName: string, itemName: SavedItems, newPT: (item: T, client: BasePinguClient) => PT, typeManager: (client: BasePinguClient, pItem: PT) => BaseManager<T>);
    private _model;
    add(item: T, scriptName: string, reason: string): Promise<PT>;
    fetch(item: T, scriptName: string, reason: string): Promise<PT>;
    update(pItem: PT, scriptName: string, reason: string): Promise<PT>;
    delete(item: T, scriptName: string, reason: string): Promise<this>;
    refresh(client?: BasePinguClient): Promise<this>;
}
export default PinguCollection;
