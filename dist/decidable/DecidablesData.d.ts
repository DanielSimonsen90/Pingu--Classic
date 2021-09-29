import PinguClient from "../pingu/client/PinguClient";
import { ExecuteFunctionProps } from "../pingu/handlers/Command/PinguCommandBase";
import { CommandParams } from "../pingu/handlers/Pingu/PinguCommand";
import { BaseExecuteProps, DecidablesParams, DecidablesTypes } from "./DecidableCommandProps";
declare type TimeableDecidables = Exclude<DecidablesTypes, 'Suggestion'>;
declare type Timeable = DecidablesData<TimeableDecidables, BaseExecuteProps<TimeableDecidables>>;
export default class DecidablesData<DecidablesType extends DecidablesTypes, ExecuteProps extends BaseExecuteProps<DecidablesType>> implements DecidablesParams<DecidablesType> {
    executeProps: ExecuteFunctionProps<PinguClient> & CommandParams & ExecuteProps;
    constructor(executeProps: ExecuteFunctionProps<PinguClient> & CommandParams & ExecuteProps);
    get client(): PinguClient;
    get command(): import("./DecidableCommandProps").SubCommand<DecidablesType>;
    get commandProps(): import("../pingu/handlers/Command/PinguCommandBase").CommandProps;
    get components(): Map<string, import("..").PinguActionRow>;
    get config(): import("./DecidableCommandProps").DecidableConfigs[DecidablesType];
    get filter(): import("./DecidableCommandProps").IFilterOptions;
    get pAuthor(): import("..").PinguUser;
    get pGuildMember(): import("..").PinguGuildMember;
    get pGuild(): import("..").PinguGuild;
    get pGuildClient(): import("..").PClient;
    get pItems(): import("../pingu/handlers/Pingu/PinguCommand").PItems;
    get reactions(): string[];
    get reply(): import("../pingu/handlers/Command/PinguCommandBase").ReplyMethods;
    get replyPrivate(): (options: import("../pingu/handlers/Command/PinguCommandBase").ReplyOptions) => import("../pingu/handlers/Command/PinguCommandBase").ReplyReturn;
    get replySemiPrivate(): (options: import("../pingu/handlers/Command/PinguCommandBase").ReplyOptions) => import("../pingu/handlers/Command/PinguCommandBase").ReplyReturn;
    get replyPublic(): (options: import("../pingu/handlers/Command/PinguCommandBase").ReplyOptions) => import("../pingu/handlers/Command/PinguCommandBase").ReplyReturn;
    get replyReturn(): (options: import("../pingu/handlers/Command/PinguCommandBase").ReplyOptions) => import("../pingu/handlers/Command/PinguCommandBase").ReplyReturn;
    get followUp(): (options: import("../pingu/handlers/Command/PinguCommandBase").ReplyOptions) => import("../pingu/handlers/Command/PinguCommandBase").ReplyReturn;
    get runOptions(): import("./DecidableCommandProps").IRunDecidable<DecidablesType>;
    get setup(): import("./DecidableCommandProps").ISetupOptions<DecidablesType>;
    get type(): DecidablesTypes;
    get lowerType(): string;
    is<T extends DecidablesTypes>(type: T): this is DecidablesData<T, BaseExecuteProps<T>>;
    isTimable(): this is Timeable;
    isGiveawayType(): this is DecidablesData<'Giveaway', BaseExecuteProps<'Giveaway'>> & DecidablesData<'Theme', BaseExecuteProps<'Theme'>>;
}
export {};
