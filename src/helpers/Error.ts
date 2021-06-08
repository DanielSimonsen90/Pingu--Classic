export class PinguError extends global.Error {
    constructor(err: string | globalThis.Error) {
        super(err == typeof 'string' ? err as string : (err as globalThis.Error).message);
    }
}

export default PinguError;