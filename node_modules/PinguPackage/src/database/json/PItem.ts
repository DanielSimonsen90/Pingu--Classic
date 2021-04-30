export class PItem {
    constructor(object: { id: string, name: string }) {
        this._id = object.id;
        this.name = object.name;
    }
    public _id: string
    public name: string
}

export default PItem;