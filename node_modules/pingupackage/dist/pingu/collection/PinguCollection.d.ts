import PinguClientShell from '../client/PinguClientShell';
import IPinguCollection, { BaseT, BasePT, SavedItems, BaseManager } from './IPinguCollection';
export declare class PinguCollection<T extends BaseT, PT extends BasePT> extends IPinguCollection<T, PT> {
    constructor(client: PinguClientShell, logChannelName: string, itemName: SavedItems, newPT: (item: T, client: PinguClientShell) => PT, typeManager: (client: PinguClientShell, pItem: PT) => BaseManager<T>);
    private _model;
    add(item: T, scriptName: string, reason: string): Promise<PT>;
    fetch(item: T, scriptName: string, reason: string): Promise<PT>;
    update(pItem: PT, scriptName: string, reason: string): Promise<PT>;
    delete(item: T, scriptName: string, reason: string): Promise<this>;
    refresh(client?: PinguClientShell): Promise<this>;
}
export default PinguCollection;
