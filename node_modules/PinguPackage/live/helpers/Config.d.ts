interface IEmailer {
    id: string;
    secret: string;
    refreshToken: string;
}
export interface IConfigRequirements {
    Prefix: string;
    BetaPrefix?: string;
    token: string;
    mongoPass?: string;
    api_key?: string;
    youtube_api?: string;
    google_custom_search?: string;
    emailer: IEmailer;
    version?: number;
    testingMode?: boolean;
    updateStats?: boolean;
}
export declare class Config {
    constructor(config: IConfigRequirements);
    Prefix: string;
    BetaPrefix: string;
    token: string;
    mongoPass: string;
    api_key: string;
    youtube_api: string;
    google_custom_search: string;
    emailer: IEmailer;
    version: number;
    testingMode: boolean;
    updateStats: boolean;
}
export {};
