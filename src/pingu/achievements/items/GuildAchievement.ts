import { AchievementBase, AchievementBaseType, guildOnlyCommands } from "./AchievementBase";
import { GetPGuilds } from "../../guild/PinguGuild";
import { Percentage } from "../../../helpers";

export interface GuildAchievementType extends AchievementBaseType {
    COMMAND: guildOnlyCommands,
    CHANNEL: 'Giveaway' | 'Poll' | 'Suggestion' | 'Emotes' | 'Publish' | 'Clear' | 'Prefix' | 'Slowmode' | 'Role' | 'Music'
    VOICE: 'Connected' | 'Disconnected' | 'Move' | 'Deaf' | 'Mute' | 'Streaming' | 'Video' | 'Noice'
}
export type GuildAchievementTypeKey = keyof GuildAchievementType;

export class GuildAchievement<Key extends GuildAchievementTypeKey> extends AchievementBase {
    constructor(id: number, name: string, key: Key, type: GuildAchievementType[Key], description: string) {
        super(id, name, description);
        this.key = key;
        this.type = type;
    }

    public key: Key;
    public type: GuildAchievementType[Key];

    public async getPercentage() {
        let pGuilds = await GetPGuilds();
        let whole = pGuilds.length;
        let part = pGuilds.filter(pGuild => pGuild.settings.config.achievements.achievements.find(a => a._id == this._id)).length;
        return new Percentage(whole, part);
    }

    public static Achievements: GuildAchievement<GuildAchievementTypeKey>[] = [
        
    ]
}