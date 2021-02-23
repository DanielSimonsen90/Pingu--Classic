export abstract class PinguHandler {
    constructor(name: string) {
        this.name = name;
    }
    
    public name: string
    public path: string
}