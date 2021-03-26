import { Collection, Guild, Snowflake } from "discord.js";
import { AchievementBase } from "./AchievementBase";
import { GuildAchievementType } from "./GuildAchievement";
import { GetPGuild } from "../../guild/PinguGuild";
import { PinguGuildMember } from "../../guildMember/PinguGuildMember";
import { Percentage } from "../../../helpers";

export interface GuildMemberAchievementType extends GuildAchievementType {}
export type GuildMemberAchievementTypeKey = keyof GuildMemberAchievementType;

export class GuildMemberAchievement<Key extends keyof GuildAchievementType> extends AchievementBase {
    constructor(id: number, name: string, key: Key, type: GuildAchievementType[Key], description: string) {
        super(id, name, description);
        this.key = key;
        this.type = type;
    }

    public key: Key;
    public type: GuildMemberAchievementType[Key];

    public async getPercentage(guild: Guild) {
        let pGuildMembers = ((await GetPGuild(guild)).members as Collection<Snowflake, PinguGuildMember>).array();
        let whole = pGuildMembers.length;
        let part = pGuildMembers.filter(pGuildMember => pGuildMember.achievementsConfig.achievements.find(a => a._id == this._id)).length;
        return new Percentage(whole, part);
    }

    public static Achievements: GuildMemberAchievement<GuildMemberAchievementTypeKey>[] = [

    ];
}