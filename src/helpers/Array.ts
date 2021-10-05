export default class PinguArray<T> extends Array<T> {
    public remove(item: T): T {
        return this.includes(item) ? this.splice(this.indexOf(item), 1)[0] : null;
    }
    public random(): T {
        const r = Math.round(Math.random() * this.length);
        return this[r];
    }
}
export { PinguArray }