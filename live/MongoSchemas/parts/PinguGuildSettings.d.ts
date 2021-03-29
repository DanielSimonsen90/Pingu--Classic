export declare const PinguGuildSettings: {
    welcomeChannel: {
        _id: StringConstructor;
        name: StringConstructor;
    };
    reactionRoles: {
        channel: {
            _id: StringConstructor;
            name: StringConstructor;
        };
        messageID: StringConstructor;
        emoteName: StringConstructor;
        pRole: {
            _id: StringConstructor;
            name: StringConstructor;
        };
    }[];
    config: {
        decidables: {
            giveawayConfig: {
                allowSameWinner: BooleanConstructor;
                hostRole: {
                    _id: StringConstructor;
                    name: StringConstructor;
                };
                winnerRole: {
                    _id: StringConstructor;
                    name: StringConstructor;
                };
                giveaways: {
                    winners: {
                        _id: StringConstructor;
                        name: StringConstructor;
                    }[];
                    value: StringConstructor;
                    _id: StringConstructor;
                    author: {
                        _id: StringConstructor;
                        name: StringConstructor;
                    };
                    channel: {
                        _id: StringConstructor;
                        name: StringConstructor;
                    };
                    endsAt: DateConstructor;
                }[];
                firstTimeExecuted: BooleanConstructor;
                channel: {
                    _id: StringConstructor;
                    name: StringConstructor;
                };
            };
            pollConfig: {
                pollsRole: {
                    _id: StringConstructor;
                    name: StringConstructor;
                };
                polls: {
                    YesVotes: NumberConstructor;
                    NoVotes: NumberConstructor;
                    approved: StringConstructor;
                    value: StringConstructor;
                    _id: StringConstructor;
                    author: {
                        _id: StringConstructor;
                        name: StringConstructor;
                    };
                    channel: {
                        _id: StringConstructor;
                        name: StringConstructor;
                    };
                    endsAt: DateConstructor;
                }[];
                firstTimeExecuted: BooleanConstructor;
                channel: {
                    _id: StringConstructor;
                    name: StringConstructor;
                };
            };
            suggestionConfig: {
                verifyRole: {
                    _id: StringConstructor;
                    name: StringConstructor;
                };
                suggestions: {
                    approved: StringConstructor;
                    decidedBy: {
                        _id: StringConstructor;
                        name: StringConstructor;
                    };
                    value: StringConstructor;
                    _id: StringConstructor;
                    author: {
                        _id: StringConstructor;
                        name: StringConstructor;
                    };
                    channel: {
                        _id: StringConstructor;
                        name: StringConstructor;
                    };
                    endsAt: DateConstructor;
                }[];
                firstTimeExecuted: BooleanConstructor;
                channel: {
                    _id: StringConstructor;
                    name: StringConstructor;
                };
            };
            themeConfig: {
                allowSameWinner: BooleanConstructor;
                ignoreLastWins: NumberConstructor;
                hostRole: {
                    _id: StringConstructor;
                    name: StringConstructor;
                };
                winnerRole: {
                    _id: StringConstructor;
                    name: StringConstructor;
                };
                themes: {
                    winners: {
                        _id: StringConstructor;
                        name: StringConstructor;
                    }[];
                    value: StringConstructor;
                    _id: StringConstructor;
                    author: {
                        _id: StringConstructor;
                        name: StringConstructor;
                    };
                    channel: {
                        _id: StringConstructor;
                        name: StringConstructor;
                    };
                    endsAt: DateConstructor;
                }[];
                firstTimeExecuted: BooleanConstructor;
                channel: {
                    _id: StringConstructor;
                    name: StringConstructor;
                };
            };
        };
        achievements: {
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
    };
};
