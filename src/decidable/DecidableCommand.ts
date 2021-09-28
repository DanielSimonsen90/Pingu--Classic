import { 
    DecidablesParams, DecidablesTypes, 
    SetConfigObjects, BaseExecuteProps, IValueTime, ConfigKeys, IRunDecidable,
} from './DecidableCommandProps';
import TimeSpan from '../helpers/TimeSpan';
import PinguCommand, { CommandParams } from '../pingu/handlers/Pingu/PinguCommand';
import PRole from '../database/json/PRole';
import IDecidableConfigOptions from './interfaces/IDecidableConfigOptions';
import { ExecuteFunctionProps } from '../pingu/handlers/Command/PinguCommandBase';
import PinguClient from '../pingu/client/PinguClient';

class DecidablesData<
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
    public get type() { return this.executeProps.type }

    public is<T extends DecidablesTypes>(type: DecidablesTypes): this is T {
        return this.type == type;
    }
}

export default class DecdiableCommand<
    DecidablesType extends DecidablesTypes, 
    ExecuteProps extends BaseExecuteProps<DecidablesType>
> extends PinguCommand<ExecuteProps> {
    static ValidateTime(input: string) {
        return TimeSpan.ms(input);
    }
    static ExecuteDecidables<
        DecidablesType extends DecidablesTypes, 
        ExecuteProps extends BaseExecuteProps<DecidablesType>
    > (cmd: DecdiableCommand<DecidablesType, ExecuteProps>, params: DecidablesParams<DecidablesType>) {
        return cmd.handleDecdiables(params);
    }

    private _configs: Map<IDecidableConfigOptions, ConfigKeys<any>>
    private _data: DecidablesData<DecidablesType, ExecuteProps>;

    public async handleDecdiables(params: DecidablesParams<DecidablesType>) {
        const { executeProps: {
            client, commandProps: { executor, member, guild, channel: executedFrom }, components,
            pAuthor, pGuildMember, pGuild, pGuildClient,
            replyPublic, replySemiPrivate, replyPrivate, replyReturn, followUp, allowPrivate,
            type, command, reactions, config, filter, setup, runOptions
        }} = params;
        const { firstTimeExecuted, channel } = config;
        this._data = new DecidablesData<DecidablesType, ExecuteProps>(params.executeProps as any);

        //A decidables command must have a Pingu Guild registered
        if (!pGuild) {
            await client.log('error', `Unable to host ${type.toLowerCase()} for ${guild}, as I couldn't get their PinguGuild!`);
            return replyReturn(`I couldn't get your PinguGuild, so I can't host the ${type.toLowerCase()} for you!`);
        }

        const decidablesConfig = pGuild.settings.config.decidables;
        this._configs = SetConfigObjects(decidablesConfig);
    }

    protected async permissionCheckDecidable() {
        const { client, config, commandProps: { member }, executeProps } = this._data;
        const { PermissionGranted } = client.permissions;
        const { hostRole } = this._configs.get(config);

        if (!this._data.is('Poll')) {
            return PermissionGranted;
        }
        
        if (!member.permissions.has('ADMINISTRATOR') && hostRole && !member.roles.cache.has(hostRole._id)) {
            return "You don't have `Administrator` permissions" + (hostRole ? ` or the \`${hostRole.name}\` role` : "" + "!");
        }

        const { time } = this._data.executeProps.runOptions;
        if (!time) return 'Please provide a valid time!';

        const timeValue = runOptions
    }

    public async checkRoleUpdates(params: DecidablesParams<DecidablesType>) {
        const { executeProps: { config, type, commandProps: { guild } } } = params;
        const hostPRole = this._configs.get(config).hostRole;
        const winnerPRole = this._configs.get(config).winnerRole;
        const CheckRole = (pRole: PRole) => pRole && guild.roles.fetch(pRole._id);
        const [hostRole, winnerRole] = await Promise.all([
            CheckRole(hostPRole), CheckRole(winnerPRole)
        ]);
        
        const noWinnerRole = !winnerRole && !winnerPRole;
        const noHostRole = !hostRole && !hostPRole;
        const winnerNameChanged = !noWinnerRole && winnerRole.name != winnerPRole.name;
        const hostNameChanged = !noHostRole && hostRole.name != hostPRole.name;

        //Any condition is true
        if ([noWinnerRole, noHostRole, winnerNameChanged, hostNameChanged].some(v => v)) {
            await this.updatePGuilds(params, `${type} role${type == 'Giveaway' ? 's' : ''} updated.`);
        }
    }
    protected updatePGuilds(params: DecidablesParams<DecidablesType>, reason: string) {
        const { executeProps: { client, type, pGuild } } = params;
        return client.pGuilds.update(pGuild, `HandleDecidables: ${type}`, reason);
    }
    protected is<T extends DecidablesType>(type: T, params: DecidablesParams<DecidablesType>): params is DecidablesParams<T> {
        return this.name == type.toLowerCase();
    }
}

export {
    BaseExecuteProps as DecidablesExecuteProps
}