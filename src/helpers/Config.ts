interface IEmailer {
    id: string,
    secret: string,
    refreshToken: string
}

export interface IConfigRequirements {
    Prefix: string,
    BetaPrefix?: string,
    token: string,
    mongoPass?: string,
    api_key?: string,
    youtube_api?: string,
    google_custom_search?: string,
    emailer: IEmailer
    version?: number,
    testingMode?: boolean,
    updateStats?: boolean
}

export class Config {
    constructor(config: IConfigRequirements) {
        this.Prefix = config.Prefix;
        this.BetaPrefix = config.BetaPrefix;
        this.token = config.token;
        this.mongoPass = config.mongoPass;
        this.api_key = config.api_key;
        this.youtube_api = config.youtube_api;
        this.google_custom_search = config.google_custom_search;
        this.emailer = config.emailer;
        this.version = config.version;
        this.testingMode = config.testingMode;
        this.updateStats = config.updateStats;
    }

    public Prefix: string;
    public BetaPrefix: string;
    public token: string;
    public mongoPass: string;
    public api_key: string;
    public youtube_api: string;
    public google_custom_search: string;
    public emailer: IEmailer
    public version: number = 1;
    public testingMode: boolean = false;
    public updateStats: boolean = false;
}