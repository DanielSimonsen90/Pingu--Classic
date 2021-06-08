export declare class Reason {
    constructor(noun: 'create' | 'update' | 'delete', database: 'PinguGuild' | 'PinguUser', name: string, reason: string);
    private reason;
    succMsg: string;
    errMsg: string;
}
export default Reason;
