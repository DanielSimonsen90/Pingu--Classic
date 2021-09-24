import { 
    DecidablesParams, DecidablesTypes, 
    SetConfigObjects, BaseExecuteProps, IValueTime,
} from './DecidableCommandProps';
import TimeSpan from '../helpers/TimeSpan';
import PinguCommand from '../pingu/handlers/Pingu/PinguCommand';
import PRole from '../database/json/PRole';

export default class DecdiableCommand<
    DecidableType extends DecidablesTypes, 
    ExecuteProps extends BaseExecuteProps<DecidableType>
> extends PinguCommand<ExecuteProps> {
    static valudateTime(input: string) {
        return TimeSpan.ms(input);
    }
    static async HandleDecdiables<T extends DecidablesTypes>(params: DecidablesParams<T>) {
        const { executeProps } = params;
        const { 
            client, commandProps, components,
            pAuthor, pGuildMember, pGuild, pGuildClient,
            replyPublic, replySemiPrivate, replyPrivate, replyReturn, followUp, allowPrivate,
            type, command, reactions, config, filter, setup, runOptions,
        } = executeProps;
        const { executor, member, guild, channel: executedFrom } = commandProps;
        const { firstTimeExecuted, channel } = config;

        //A decidables command must have a Pingu Guild registered
        if (!pGuild) {
            await client.log('error', `Unable to host ${type.toLowerCase()} for ${guild}, as I couldn't get their PinguGuild!`);
            return replyReturn(`I couldn't get your PinguGuild, so I can't host the ${type.toLowerCase()} for you!`);
        }

        const decidablesConfig = pGuild.settings.config.decidables;
        const Configs = SetConfigObjects(decidablesConfig);

        async function PermissionCheckDecidable() {
            const { PermissionGranted } = client.permissions;
            const { hostRole } = Configs.get(config);

            await (async function CheckRoleUpdates() {
                const hostPRole = Configs.get(config).hostRole;
                const winnerPRole = Configs.get(config).winnerRole;
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
                    await UpdatePGuild(`${type} role${type == 'Giveaway' ? 's' : ''} updated.`);
                }
            })();
        
            if (isSuggestion(type)) return PermissionGranted;
            
            if (!member.permissions.has('ADMINISTRATOR') && hostRole && !member.roles.cache.has(hostRole._id)) {
                return "You don't have `Administrator` permissions" + (hostRole ? ` or the \`${hostRole.name}\` role` : "" + "!");
            }

            const { time } = (runOptions as IValueTime);
            if (!time) return 'Please provide a valid time!';

            const timeValue = 
        }
        async function UpdatePGuild(reason: string) {
            return client.pGuilds.update(pGuild, `HandleDecidables: ${type}`, reason);
        }

        function is(type: DecidablesTypes, t: DecidablesTypes): type is typeof t {
            return type == t;
        }
        function isSuggestion(type: DecidablesTypes): type is 'Suggestion' {
            return type == 'Suggestion';
        }
    }
}

export {
    BaseExecuteProps as DecidablesExecuteProps
}