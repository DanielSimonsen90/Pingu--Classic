export interface IConfigRequirements {
    prefix: string;
    betaPrefix?: string;
    token: string;
    mongoPass?: string;
    api_key?: string;
    google_custom_search?: string;
    version?: string;
    testingMode?: boolean;
    updateStats?: boolean;
    nsfw_words?: string[];
}
export default IConfigRequirements;
