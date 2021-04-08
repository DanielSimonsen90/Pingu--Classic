export class Percentage {
    constructor(whole: number, part: number) {
        this.whole = whole;
        this.part = part;
        this.value = whole / 100 * part;
    }

    public whole: number;
    public part: number;
    public value: number;
}