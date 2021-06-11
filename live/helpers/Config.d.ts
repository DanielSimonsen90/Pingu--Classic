interface IEmailer {
    id: string;
    secret: string;
    refreshToken: string;
}
export default interface IConfigRequirements {
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
export {};
