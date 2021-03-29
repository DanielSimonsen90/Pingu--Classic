export declare const AchievementsConfig: {
    notificationType: StringConstructor;
    achievements: {
        _id: StringConstructor;
        achievedAt: DateConstructor;
    }[];
    enabled: BooleanConstructor;
    channel: {
        _id: StringConstructor;
        name: StringConstructor;
    };
};
export declare const GuildAchievementsConfig: {
    guildID: StringConstructor;
    notificationType: {
        guild: StringConstructor;
        members: StringConstructor;
    };
    achievements: {
        _id: StringConstructor;
        achievedAt: DateConstructor;
    }[];
    enabled: BooleanConstructor;
    channel: {
        _id: StringConstructor;
        name: StringConstructor;
    };
};
