import PinguClient from "../pingu/client/PinguClient";
import { ExecuteFunctionProps } from "../pingu/handlers/Command/PinguCommandBase";
import { CommandParams } from "../pingu/handlers/Pingu/PinguCommand";
import { BaseExecuteProps, DecidablesParams, DecidablesTypes } from "./DecidableCommandProps";

type TimeableDecidables = Exclude<DecidablesTypes, 'Suggestion'>;
type Timeable = DecidablesData<TimeableDecidables, BaseExecuteProps<TimeableDecidables>>

export default class DecidablesData<
    DecidablesType extends DecidablesTypes, 
    ExecuteProps extends BaseExecuteProps<DecidablesType>
> implements DecidablesParams<DecidablesType> {
    constructor(public executeProps: ExecuteFunctionProps<PinguClient> & CommandParams & ExecuteProps) {}

    public get client() { return this.executeProps.client; }
    public get command() { return this.executeProps.command }
    public get commandProps() { return this.executeProps.commandProps }
    public get components() { return this.executeProps.components }
    public get config() { return this.executeProps.config }
    public get filter() { return this.executeProps.filter }
    public get pAuthor() { return this.executeProps.pAuthor }
    public get pGuildMember() { return this.executeProps.pGuildMember }
    public get pGuild() { return this.executeProps.pGuild }
    public get pGuildClient() { return this.executeProps.pGuildClient }
    public get pItems() { return this.executeProps.pItems }
    public get reactions() { return this.executeProps.reactions }
    public get reply() { return this.executeProps.reply }
    public get replyPrivate() { return this.executeProps.replyPrivate }
    public get replySemiPrivate() { return this.executeProps.replySemiPrivate }
    public get replyPublic() { return this.executeProps.replyPublic }
    public get replyReturn() { return this.executeProps.replyReturn }
    public get followUp() { return this.executeProps.followUp }
    public get runOptions() { return this.executeProps.runOptions }
    public get setup() { return this.executeProps.setup }
    public get type(): DecidablesTypes { return this.executeProps.type }
    public get lowerType() { return this.type.toLowerCase() }

    public is<T extends DecidablesTypes>(type: T): this is DecidablesData<T, BaseExecuteProps<T>> {
        return this.type == type;
    }
    public isTimable(): this is Timeable {
        return this.type != 'Suggestion';
    }
    public isGiveawayType(): this is DecidablesData<'Giveaway', BaseExecuteProps<'Giveaway'>> & DecidablesData<'Theme', BaseExecuteProps<'Theme'>> {
        return this.type == 'Giveaway' || this.type == 'Theme';
    }
}