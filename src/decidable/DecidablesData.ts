import PinguClient from "../pingu/client/PinguClient";
import { ExecuteFunctionProps } from "../pingu/handlers/Command/PinguCommandBase";
import { CommandParams } from "../pingu/handlers/Pingu/PinguCommand";
import { BaseExecuteProps, DecidableConfigs, DecidablesParams, DecidablesTypes, GiveawayTypes, IExecuteProps, IFilterOptions, IRunDecidable, ISetupOptions, SubCommand, TimeableType } from "./DecidableCommandProps";

export default class DecidablesData<
    DecidablesType extends DecidablesTypes, 
    ExecuteProps extends BaseExecuteProps<DecidablesType>
> implements DecidablesParams<DecidablesType> {
    constructor(public executeProps: ExecuteFunctionProps<PinguClient> & CommandParams & ExecuteProps) {}

    public get client() { return this.executeProps.client; }
    public get commandProps() { return this.executeProps.commandProps }
    public get components() { return this.executeProps.components }
    
    public get pItems() { return this.executeProps.pItems }
    public get pAuthor() { return this.executeProps.pAuthor }
    public get pGuildMember() { return this.executeProps.pGuildMember }
    public get pGuild() { return this.executeProps.pGuild }
    public get pGuildClient() { return this.executeProps.pGuildClient }

    public get reply() { return this.executeProps.reply }
    public get replyPrivate() { return this.executeProps.replyPrivate }
    public get replySemiPrivate() { return this.executeProps.replySemiPrivate }
    public get replyPublic() { return this.executeProps.replyPublic }
    public get replyReturn() { return this.executeProps.replyReturn }
    public get followUp() { return this.executeProps.followUp }

    public get type(): DecidablesTypes { return this.executeProps.type }
    public get lowerType() { return this.type.toLowerCase() }
    public get command(): SubCommand<DecidablesType> { return this.executeProps.command as SubCommand<DecidablesType> }
    public get config(): DecidableConfigs[DecidablesType] { return this.executeProps.config as DecidableConfigs[DecidablesType] }
    public get reactions(): Array<string> { return this.executeProps.reactions }
    public get filter(): IFilterOptions<DecidablesType> { return this.executeProps.filter as IFilterOptions<DecidablesType> }
    public get setup(): ISetupOptions<DecidablesType> { return this.executeProps.setup }
    public get runOptions(): IRunDecidable<DecidablesType> { return this.executeProps.runOptions as IRunDecidable<DecidablesType> }

    public is<T extends DecidablesTypes>(type: T): this is DecidablesData<T, BaseExecuteProps<T>> {
        return this.type == type;
    }
    public isTimable(): this is DecidablesData<TimeableType, BaseExecuteProps<TimeableType>> {
        return !this.is('Suggestion')
    }
    public isGiveawayType(): this is DecidablesData<GiveawayTypes, BaseExecuteProps<GiveawayTypes>> {
        return this.type == 'Giveaway' || this.type == 'Theme';
    }
}