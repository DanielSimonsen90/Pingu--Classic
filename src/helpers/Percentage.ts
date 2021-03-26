export class Percentage {
    constructor(whole: number, part: number) {
        this.whole = whole;
        this.part = part;
        this.value = this.calculateValue();
    }

    public whole: number;
    public part: number;
    public value: number;

    private calculateValue() {
        return this.whole / 100 * this.part;
    }
}