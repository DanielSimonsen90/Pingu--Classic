import { Guild, Message, User, GuildMember } from 'discord.js';
import PinguClientBase from '../client/PinguClientBase';

import { AchieverTypes, AchievementBaseType } from "./items/AchievementBase";
import { UserAchievement, UserAchievementType, UserAchievementTypeKey, UserAchievementCallbackParams } from "./items/UserAchievement";
import { GuildMemberAchievement, GuildMemberAchievementType, GuildMemberAchievementTypeKey, GuildMemberAchievementCallbackParams } from "./items/GuildMemberAchievement";
import { GuildAchievement, GuildAchievementType, GuildAchievementTypeKey, GuildAchievementCallbackParams } from "./items/GuildAchievement";

import UserAchievementConfig from "./config/UserAchievementConfig";
import GuildMemberAchievementConfig from "./config/GuildMemberAchievementConfig";
import GuildAchievementConfig from "./config/GuildAchievementConfig";

import PAchievement from "../../database/json/PAchievement";

interface Achievements {
    USER: UserAchievement<UserAchievementTypeKey, UserAchievementType[UserAchievementTypeKey]>,
    GUILDMEMBER: GuildMemberAchievement<GuildMemberAchievementTypeKey, GuildMemberAchievementType[GuildMemberAchievementTypeKey]>,
    GUILD: GuildAchievement<GuildAchievementTypeKey, GuildMemberAchievementType[GuildMemberAchievementTypeKey]>
}
interface AchievementTypes {
    USER: UserAchievementType,
    GUILDMEMBER: GuildMemberAchievementType,
    GUILD: GuildAchievementType
}
interface AchieverConfigs {
    USER: UserAchievementConfig,
    GUILDMEMBER: GuildMemberAchievementConfig,
    GUILD: GuildAchievementConfig
}
interface Achievers {
    USER: User,
    GUILDMEMBER: GuildMember,
    GUILD: Guild
}
interface AchievementCallbackParams {
    USER: UserAchievementCallbackParams,
    GUILDMEMBER: GuildMemberAchievementCallbackParams,
    GUILD: GuildAchievementCallbackParams
}
export async function AchievementCheckType
    <AchieverType extends AchieverTypes,
    AchievementType extends Achievements[AchieverType],
    Key extends keyof AchievementTypes[AchieverType],
    Type extends AchievementTypes[AchieverType][Key],
    CallbackKey extends keyof AchievementCallbackParams[AchieverType]>
    (
        client: PinguClientBase,
        achieverType: AchieverType, 
        achiever: Achievers[AchieverType], 
        key: Key, 
        keyType: Type,
        config: AchieverConfigs[AchieverType],
        callbackKey: CallbackKey,
        callback: AchievementCallbackParams[AchieverType][CallbackKey][keyof AchievementCallbackParams[AchieverType][CallbackKey]]
    ): Promise<Message> {
    const filter = (arr: AchievementType[]) =>  arr.filter(i => i.key == key && i.type == (keyType as any));

    let allAchievements = filter((function getAllAchievements() {
        switch (achieverType) {
            case 'USER': return UserAchievement.Achievements as AchievementType[];
            case 'GUILDMEMBER': return GuildMemberAchievement.Achievements as AchievementType[];
            case 'GUILD': return GuildAchievement.Achievements as AchievementType[];
            default: return null;
        }
    })());
    if (!allAchievements) return null;

    let pAchievements = ((await (async function getAllPAchievements() {
        switch (achieverType) {
            case 'USER': 
                const user = client.pUsers.get(achiever as User);
                return user?.achievementConfig.achievements;
            case 'GUILDMEMBER': 
                const guildMember = achiever as GuildMember;
                const member = client.pGuilds.get(guildMember.guild).members.get(guildMember.id);
                return member?.achievementConfig.achievements;
            case 'GUILD': return client.pGuilds.get(achiever as Guild).settings.config.achievements.achievements;
            default: return null;
        }
    })()) || []).map(pa => pa._id);

    //Find an achievement matching Key & Type, that achiever doesn't have, and the achievement's callback returns true
    let achievements = await (async function Find() {
        const result: AchievementType[] = [];
        for (const a of allAchievements)
            if (!pAchievements.includes(a._id) && await a.callback(callback as never))
                result.push(a);
        return result;
    })();

    if (!achievements.length) return null;

    return (await Promise.all(achievements.map(async achievement => {
        let pAchievement = new PAchievement({ _id: achievement._id, achievedAt: new Date() });
        
        try {
            const notificationType = (config as UserAchievementConfig).notificationType || (config as GuildAchievementConfig).notificationTypes.guild;
        } catch (err) {
            config = (function newConfig() {
                switch (achieverType) {
                    case 'USER': return new UserAchievementConfig('NONE');
                    case 'GUILDMEMBER': return new GuildMemberAchievementConfig('NONE');
                    case 'GUILD': return new GuildAchievementConfig({ guild: 'NONE', members: 'NONE' }, achiever.id);
                    default: return null;
                }
            })() as AchieverConfigs[AchieverType];            
        }

        await (async function UpdateDB() {
            const scriptName = 'PinguLibrary.AchievementCheckType()'
            switch (achieverType) {
                case 'USER':
                    let pUser = client.pUsers.get(achiever as User);
                    pUser.achievementConfig.achievements.push(pAchievement);

                    return client.pUsers.update(pUser, scriptName, 
                        `Added ${achieverType.toLowerCase()} achievement, #${pAchievement._id} "${achievement.name}" to **${(achiever as User).tag}**'s PinguUser achievements collection`
                    );
                case 'GUILDMEMBER':
                    const guildMember = achiever as GuildMember;
                    let pGuildMember = client.pGuilds.get(guildMember.guild).members.get(guildMember.id);
                    pGuildMember.achievementConfig.achievements.push(pAchievement);

                    return client.pGuildMembers.get(guildMember.guild).update(pGuildMember, scriptName, 
                        `Added ${achieverType.toLowerCase()} achievement, #${pAchievement._id} "${achievement.name}" to **${(achiever as GuildMember).user.tag}**'s PinguGuildMember achievements collection`
                    );
                case 'GUILD':
                    let pGuild = client.pGuilds.get(achiever as Guild);
                    pGuild.settings.config.achievements.achievements.push(pAchievement);

                    return client.pGuilds.update(pGuild, scriptName, 
                        `Added ${achieverType.toLowerCase()} achievement, #${pAchievement._id} "${achievement.name}" to **${(achiever as Guild).name}**'s PinguGuild achievements collection`
                    );
                default: return null;
            }
        })();

        return (function notify() {
            switch (achieverType) {
                case 'USER': return UserAchievementConfig.notify(
                    client, 
                    achiever as User, 
                    achievement as unknown as UserAchievement<UserAchievementTypeKey, UserAchievementType[UserAchievementTypeKey]>,
                    config as UserAchievementConfig
                );
                case 'GUILDMEMBER': return GuildMemberAchievementConfig.notify(
                    client, 
                    achiever as GuildMember, 
                    achievement as unknown as GuildMemberAchievement<GuildMemberAchievementTypeKey, GuildMemberAchievementType[GuildMemberAchievementTypeKey]>, 
                    config as GuildMemberAchievementConfig
                );
                case 'GUILD': return GuildAchievementConfig.notify(
                    client, 
                    achiever as Guild, 
                    achievement as unknown as GuildAchievement<GuildMemberAchievementTypeKey, GuildMemberAchievementType[GuildMemberAchievementTypeKey]>, 
                    config as GuildAchievementConfig
                );
                default: return null;
            }
        })();
    })))[0];
}
export interface AchievementCheckData {
    user: User,
    guildMember?: GuildMember,
    guild?: Guild
}

export async function AchievementCheck
<AchievementType extends GuildMemberAchievementType | GuildAchievementType | AchievementBaseType,
Key extends keyof AchievementType, Type extends AchievementType[Key],>
(client: PinguClientBase, data: AchievementCheckData, key: Key, type: Type, callback: any[]) {
    if (data.user && !data.user.bot) {
        const pUser = client.pUsers.get(data.user);
        if (!pUser) return false;

        var givenAchievement = await AchievementCheckType(
            client, 'USER', data.user, 
            key as keyof UserAchievementType, 
            type as unknown as string, pUser.achievementConfig, 
            key as keyof UserAchievementType, 
            callback as never
        );
    }

    if (data.guild) {
        let pGuild = client.pGuilds.get(data.guild);
        if (!pGuild) return false;

        givenAchievement = await AchievementCheckType(
            client, 'GUILD', data.guild, 
            key as keyof GuildAchievementType, 
            type as unknown as string, 
            pGuild.settings.config.achievements, 
            key as keyof GuildAchievementType, 
            callback as never
        );
    }
    if (data.guildMember && !data.guildMember.user?.bot) {
        let pGuildMember = client.pGuilds.get(data.guildMember.guild).members.get(data.guildMember.id);
        if (!pGuildMember) return false;

        givenAchievement = await AchievementCheckType(
            client, 'GUILDMEMBER', data.guildMember, 
            key as keyof GuildMemberAchievementType, 
            type as unknown as string, 
            pGuildMember.achievementConfig, 
            key as keyof GuildMemberAchievementType, 
            callback as never
        );
    }
    return givenAchievement != null;
}