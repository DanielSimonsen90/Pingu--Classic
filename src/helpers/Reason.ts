export class Reason {
    constructor(noun: 'create' | 'update' | 'delete' | 'fetch', database: 'PinguGuild' | 'PinguUser', name: string, reason: string) {
        this.reason = reason/*.substring(0, 1).toUpperCase() + reason.substring(1).toLowerCase()*/;

        if (!['.','!','?',':'].includes(reason[reason.length - 1])) 
            this.reason += '.';

        const pastNoun = noun == 'fetch' ? 'fetched' : `${noun}d`;

        this.succMsg = `Successfully ${pastNoun} ${database} "${name}": ${this.reason}`;
        this.errMsg = `Failed to ${noun} ${database} "${name}": ${this.reason}`;
    }

    private reason: string;
    public succMsg: string;
    public errMsg: string;
}

export default Reason;