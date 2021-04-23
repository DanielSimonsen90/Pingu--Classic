import { AchievementBase, AchievementBaseType, noGuildOnlyCommands, AchievementCallbackParams } from "./AchievementBase";
export interface UserAchievementType extends AchievementBaseType  {
    COMMAND: noGuildOnlyCommands
}
export type UserAchievementTypeKey = keyof UserAchievementType;

export interface UserAchievementCallbackParams extends AchievementCallbackParams {}

import { IUserAchievement } from "./IAchievementBase";
import { User } from "discord.js";
import { GetPinguUsers, GetPUser, GetUpdatedProperty } from "../../user/PinguUser";
import { Percentage } from "../../../helpers";
import { SavedServers } from "../../library/PinguLibrary";

export class UserAchievement
<Key extends keyof UserAchievementType, 
Type extends UserAchievementType[Key]> 
extends AchievementBase implements IUserAchievement<Key, Type, AchievementCallbackParams> {
    constructor(id: number, name: string, key: Key, type: Type, description: string) {
        super(id, name, description);
        this.key = key;
        this.type = type;
    }

    public key: Key;
    public type: Type;

    public setCallback
    <setCBType extends keyof AchievementCallbackParams[Key]>
    (
        type: setCBType, 
        callback: (params: AchievementCallbackParams[Key][setCBType]) => Promise<boolean>
    ): this {
        this.callback = callback;
        return this;
    }
    public async callback(params: AchievementCallbackParams[Key][keyof AchievementCallbackParams[Key]]): Promise<boolean> {
        return true;
    }

    public async getPercentage() {
        let pUsers = await GetPinguUsers();
        let whole = pUsers.length;
        let part = pUsers.filter(pUser => pUser.achievementConfig.achievements.find(a => a._id == this._id)).length;
        return new Percentage(whole, part);
    }

    private static DailyStreak(id: number, name: string, streak: number) {
        return new UserAchievement(id, name, 'COMMAND', 'daily', `Achieve a ${streak} streak`).setCallback('0', async ([params]) => {
            return params.pAuthor.daily.streak >= streak;
        })
    }

    public static Achievements = [
        new UserAchievement(1, "Pingu? Yeah he's my best friend!", 'EVENT', 'mostKnownUser', "Of all Pingu Users, you share the most servers with Pingu")
            .setCallback('mostKnownUser', async ([user]) => {
            const [pUser, pUsers] = await Promise.all([GetPUser(user), GetPinguUsers()])
            const mKUser = pUsers.sort((a, b) => b.sharedServers.length - a.sharedServers.length)[0];
            return pUser._id == mKUser._id
        }),
        new UserAchievement(2, 'Penguin Owner', 'EVENT', 'guildCreate', "Add Pingu to your server"),
        new UserAchievement(3, "Rest in Peace", 'EVENT', 'guildDelete', "Remove Pingu from your server"),
        new UserAchievement(4, "I'm trying something new...", 'EVENT', 'userUpdate', "Change your PinguUser information")
            .setCallback('userUpdate', async ([pre, cur]) => Object.keys(GetUpdatedProperty(pre as User, cur))[0] != null),
        new UserAchievement(5, "OwO whots dis", 'COMMAND', 'help', "Use the `help` command, to see everything you can do with Pingu"),
        new UserAchievement(6, "Curious...", 'COMMAND', 'info', "Use the `info` command to display Pingu's internal information"),
        new UserAchievement(7, 'Pong!', 'COMMAND', 'ping', "Use the `ping` command to see Pingu's latency"),
        new UserAchievement(8, "Let the penguin decide your fate", 'COMMAND', 'spinthewheel', "Use the `spinthewheel` command to get a random answer"),
        new UserAchievement(9, "50/50", 'COMMAND', 'spinthewheel', "Use the `spinthewheel` command to either yes or no")
            .setCallback('0', async ([params]) => !params.args[0]),
        new UserAchievement(10, "The dankest penguin", 'COMMAND', 'meme', "Use the `meme` command to get dank penguin memes"),
        new UserAchievement(11, "When did Discord get Snapchat streaks?", 'COMMAND', 'daily', "Use the `daily` command"),
        UserAchievement.DailyStreak(12, "The daily quarter", 25),
        UserAchievement.DailyStreak(13, "Half to 100", 50),
        UserAchievement.DailyStreak(14, "Half to 100", 50),
        UserAchievement.DailyStreak(15, "Nice", 69),
        UserAchievement.DailyStreak(16, "Dedication", 100),
        UserAchievement.DailyStreak(17, "Blaze it!", 420),
        new UserAchievement(18, "King of the Streaks", 'COMMAND', 'daily', "Achieve the highest streak among all Pingu users")
            .setCallback('0', async ([params]) => {
                const [pUser, pUsers] = await Promise.all([GetPUser(params.message.author), GetPinguUsers()]);
                const highestStreak = pUsers.sort((a, b) => b.daily.streak - a.daily.streak)[0];
                return pUser._id == highestStreak._id;
        }),
        new UserAchievement(19, "Now **this** is anonymous!", 'COMMAND', 'tell', "Use the `tell` command to message a member"),
        new UserAchievement(20, "I don't recall watching National Geographic", 'COMMAND', 'fact', "Use the `fact` command to get a random fact about penguins"),
        new UserAchievement(21, "I am penguin.", 'COMMAND', 'noot', "Use the `noot` command to say something using Pingu"),
        new UserAchievement(22, "Can I have your autograph?", 'COMMAND', 'contact', "Use the `contact` command to get information about Pingu's Owner"),
        new UserAchievement(23, "You! With me.", 'COMMAND', 'invite', "Use the `invite` command to invite Pingu to your server"),
        new UserAchievement(24, "Marry me!", 'COMMAND', 'marry', "Use the `marry` command to marry someone"),
        new UserAchievement(25, "I'm the chosen one!", 'EVENT', 'chosenUser', "Become the chosen user in Pingu Support")
            .setCallback('chosenUser', async ([user, pUser]) => pUser.sharedServers.find(pg => pg._id == SavedServers.get('Pingu Support').id) != null)
    ];
}