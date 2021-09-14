export interface IConfigRequirements {
    prefix: string,
    betaPrefix?: string,
    token: string,
    mongoPass?: string,
    api_key?: string,
    google_custom_search?: string,
    version?: number,
    testingMode?: boolean,
    updateStats?: boolean
}
export default IConfigRequirements;