"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class DecidablesData {
    executeProps;
    constructor(executeProps) {
        this.executeProps = executeProps;
    }
    get client() { return this.executeProps.client; }
    get command() { return this.executeProps.command; }
    get commandProps() { return this.executeProps.commandProps; }
    get components() { return this.executeProps.components; }
    get config() { return this.executeProps.config; }
    get filter() { return this.executeProps.filter; }
    get pAuthor() { return this.executeProps.pAuthor; }
    get pGuildMember() { return this.executeProps.pGuildMember; }
    get pGuild() { return this.executeProps.pGuild; }
    get pGuildClient() { return this.executeProps.pGuildClient; }
    get pItems() { return this.executeProps.pItems; }
    get reactions() { return this.executeProps.reactions; }
    get reply() { return this.executeProps.reply; }
    get replyPrivate() { return this.executeProps.replyPrivate; }
    get replySemiPrivate() { return this.executeProps.replySemiPrivate; }
    get replyPublic() { return this.executeProps.replyPublic; }
    get replyReturn() { return this.executeProps.replyReturn; }
    get followUp() { return this.executeProps.followUp; }
    get runOptions() { return this.executeProps.runOptions; }
    get setup() { return this.executeProps.setup; }
    get type() { return this.executeProps.type; }
    get lowerType() { return this.type.toLowerCase(); }
    is(type) {
        return this.type == type;
    }
    isTimable() {
        return this.type != 'Suggestion';
    }
    isGiveawayType() {
        return this.type == 'Giveaway' || this.type == 'Theme';
    }
}
exports.default = DecidablesData;
