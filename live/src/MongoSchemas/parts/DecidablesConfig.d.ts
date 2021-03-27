export declare const DecidablesConfig: {
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
