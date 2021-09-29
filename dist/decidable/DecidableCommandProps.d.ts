import { Giveaway, Poll, Suggestion, Theme } from './items';
export interface DecidableItems {
    Giveaway: Giveaway;
    Poll: Poll;
    Suggestion: Suggestion;
    Theme: Theme;
}
export declare type DecidablesTypes = keyof DecidableItems;
import { GiveawayConfig, PollConfig, SuggestionConfig, ThemeConfig } from "./config";
export interface DecidableConfigs {
    Giveaway: GiveawayConfig;
    Poll: PollConfig;
    Suggestion: SuggestionConfig;
    Theme: ThemeConfig;
}
import { ExecuteFunctionProps } from "../pingu/handlers/Command/PinguCommandBase";
import { CommandParams } from "../pingu/handlers/Pingu/PinguCommand";
export interface DecidablesParams<T extends DecidablesTypes> {
    executeProps: ExecuteFunctionProps & CommandParams & BaseExecuteProps<T>;
}
import IDecidableConfigOptions from './interfaces/IDecidableConfigOptions';
import PRole from '../database/json/PRole';
import Decidable from './items/Decidable';
export interface ConfigKeys<T extends DecidablesTypes> extends IDecidableConfigOptions {
    hostRole: PRole;
    collection: DecidableItems[T][];
    staffRoleType: string;
    winnerRole?: PRole;
    constructor: typeof Decidable;
    allowSameWinner?: boolean;
    ignoreLastWins?: number;
}
import DecidablesConfig from './config/DecidablesConfig';
export declare function SetConfigObjects(config: DecidablesConfig): Map<IDecidableConfigOptions, ConfigKeys<keyof DecidableItems>>;
export interface IDateFilter {
    before: Date;
    during: Date;
    after: Date;
}
export interface ILimit {
    oldest: number;
    newest: number;
}
import { GuildMember, MessageButtonStyleResolvable, Role, TextChannel } from 'discord.js';
import { MessageButtonStyles } from 'discord.js/typings/enums';
export interface IBy {
    hosted: GuildMember;
    won: GuildMember;
}
export interface IFilterOptions {
    date: IDateFilter;
    limit: ILimit;
    value: string;
    by: IBy;
    from: TextChannel;
}
interface IBaseSetupOptions {
    staffRole?: Role;
    channel?: TextChannel;
}
interface ISetupOptionsWinnable extends IBaseSetupOptions {
    winner?: Role;
    allowSameWinner?: boolean;
}
interface IThemeSetupOptions extends ISetupOptionsWinnable {
    ignoreLastWins?: number;
}
export declare type ISetupOptions<T extends DecidablesTypes> = T extends 'Theme' ? IThemeSetupOptions : T extends 'Giveaway' ? ISetupOptionsWinnable : IBaseSetupOptions;
export interface IValueable {
    value: string;
}
export interface IValueTime extends IValueable {
    time: string;
}
export interface IRunDecidableWinnable extends IValueTime {
    channel: TextChannel;
    winners: number;
    allowSameWinner: boolean;
}
export interface IRunTheme extends IRunDecidableWinnable {
    ignoreLastWins: number;
}
export declare type IRunDecidable<T extends DecidablesTypes> = T extends 'Suggestion' ? IValueable : T extends 'Poll' ? IValueTime : T extends 'Giveaway' ? IRunDecidableWinnable : IRunTheme;
declare type SubCommandBase<T extends DecidablesTypes> = 'setup' | 'list' | T;
declare type SubCommandReroll<T extends DecidablesTypes> = SubCommandBase<T> | 'reroll';
export declare type SubCommand<T extends DecidablesTypes> = T extends 'Giveaway' ? SubCommandReroll<T> : T extends 'Theme' ? SubCommandReroll<T> : SubCommandBase<T>;
export interface BaseExecuteProps<T extends DecidablesTypes> {
    type: T;
    command: SubCommand<T>;
    config: DecidableConfigs[T];
    reactions?: string[];
    filter?: IFilterOptions;
    setup?: ISetupOptions<T>;
    runOptions?: IRunDecidable<T>;
}
export interface IMenuItem {
    id: string;
    emoji: string;
    label: string;
    style: Exclude<MessageButtonStyleResolvable, 'LINK' | MessageButtonStyles.LINK>;
}
export {};
