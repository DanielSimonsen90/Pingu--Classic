export class Percentage {
    constructor(whole: number, part: number) {
        this.whole = whole;
        this.part = part;
        this.value = (function calculate() {
            var result = part / whole; //How much is part of whole
            result *= 100 //Convert to percentage
            return result.toFixed(2); //Only do 2 digits after comma; 10.00%
        })();
    }

    public whole: number;
    public part: number;
    public value: string;
}

export default Percentage;