import PinguClientBase from '../client/PinguClientBase';
import IPinguCollection, { BaseT, BasePT, SavedItems, BaseManager } from './IPinguCollection';
export declare class PinguCollection<T extends BaseT, PT extends BasePT> extends IPinguCollection<T, PT> {
    constructor(client: PinguClientBase, logChannelName: string, itemName: SavedItems, newPT: (item: T, client: PinguClientBase) => PT, typeManager: (client: PinguClientBase, pItem: PT) => BaseManager<T>);
    private _model;
    add(item: T, scriptName: string, reason: string): Promise<PT>;
    fetch(item: T, scriptName: string, reason: string): Promise<PT>;
    update(pItem: PT, scriptName: string, reason: string): Promise<PT>;
    delete(item: T, scriptName: string, reason: string): Promise<this>;
    refresh(client?: PinguClientBase): Promise<this>;
}
export default PinguCollection;
