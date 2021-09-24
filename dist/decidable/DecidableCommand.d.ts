import { DecidablesParams, DecidablesTypes, BaseExecuteProps } from './DecidableCommandProps';
import PinguCommand from '../pingu/handlers/Pingu/PinguCommand';
export default class DecdiableCommand<DecidableType extends DecidablesTypes, ExecuteProps extends BaseExecuteProps<DecidableType>> extends PinguCommand<ExecuteProps> {
    static valudateTime(input: string): number;
    static HandleDecdiables<T extends DecidablesTypes>(params: DecidablesParams<T>): Promise<import("discord.js").Message | import("discord-api-types").APIMessage>;
}
export { BaseExecuteProps as DecidablesExecuteProps };
