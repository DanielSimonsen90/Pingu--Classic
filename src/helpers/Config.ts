export default interface IConfigRequirements {
    Prefix: string,
    token: string,
    version?: number,
    BetaPrefix?: string,
    mongoPass?: string,
    api_key?: string,
    youtube_api?: string,
    google_custom_search?: string,
    testingMode?: boolean,
    updateStats?: boolean
}