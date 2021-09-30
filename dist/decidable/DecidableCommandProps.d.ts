import { Giveaway, Poll, Suggestion, Theme } from './items';
export interface DecidableItems {
    Giveaway: Giveaway;
    Poll: Poll;
    Suggestion: Suggestion;
    Theme: Theme;
}
export declare type DecidablesTypes = keyof DecidableItems;
export declare type GiveawayTypes = Exclude<DecidablesTypes, 'Poll'> & Exclude<DecidablesTypes, 'Suggestion'>;
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
import Decidable, { ApproveTypes } from './items/Decidable';
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
export interface IBySuggestion {
    suggested: GuildMember;
    decided: GuildMember;
}
export interface IByPoll {
    asked: GuildMember;
}
export interface IByGiveaway {
    hosted: GuildMember;
    won: GuildMember;
}
export declare type IBy<T extends DecidablesTypes> = T extends 'Poll' ? IByPoll : T extends 'Suggestion' ? IBySuggestion : IByGiveaway;
export interface IBaseFilterOptions<T extends DecidablesTypes> {
    date: IDateFilter;
    limit: ILimit;
    value: string;
    by: IBy<T>;
    from: TextChannel;
}
export interface IFilterOptionsDecidable<T extends Exclude<DecidablesTypes, GiveawayTypes>> extends IBaseFilterOptions<T> {
    decision: ApproveTypes;
}
export declare type IFilterOptions<T extends DecidablesTypes> = T extends Exclude<DecidablesTypes, GiveawayTypes> ? IFilterOptionsDecidable<T> : IBaseFilterOptions<T>;
export interface IBaseSetupOptions {
    staffRole?: Role;
    channel?: TextChannel;
}
export interface ISetupOptionsWinnable extends IBaseSetupOptions {
    winner?: Role;
    allowSameWinner?: boolean;
}
export interface IThemeSetupOptions extends ISetupOptionsWinnable {
    ignoreLastWins?: number;
}
export declare type ISetupOptions<T extends DecidablesTypes> = T extends 'Theme' ? IThemeSetupOptions : T extends 'Giveaway' ? ISetupOptionsWinnable : IBaseSetupOptions;
export interface IValueable {
    value: string;
    channel: TextChannel;
}
export interface IValueTime extends IValueable {
    time: string;
}
export interface IRunDecidableWinnable extends IValueTime {
    winners: number;
    allowSameWinner: boolean;
}
export interface IRunTheme extends IRunDecidableWinnable {
    ignoreLastWins: number;
}
export declare type IRunDecidable<T extends DecidablesTypes> = T extends 'Suggestion' ? IValueable : T extends 'Poll' ? IValueTime : T extends 'Giveaway' ? IRunDecidableWinnable : IRunTheme;
declare type SubCommandBase<T extends DecidablesTypes> = 'setup' | 'list' | T;
declare type SubCommandReroll<T extends DecidablesTypes> = SubCommandBase<T> | 'reroll';
declare type SubCommandTheme = SubCommandReroll<'Theme'> | 'reset';
export declare type SubCommand<T extends DecidablesTypes> = T extends 'Giveaway' ? SubCommandReroll<T> : T extends 'Theme' ? SubCommandTheme : SubCommandBase<T>;
interface IExecuteProps<T extends DecidablesTypes> {
    type: T;
    command: SubCommand<T>;
    config: DecidableConfigs[T];
    reactions?: string[];
    filter?: IFilterOptions<T>;
    setup?: ISetupOptions<T>;
    runOptions?: IRunDecidable<T>;
}
export declare type ResetSubCommand = 'channels' | 'roles' | 'general';
export declare type BaseExecuteProps<T extends DecidablesTypes> = T extends 'Theme' ? IExecuteProps<T> & {
    resetOnly: ResetSubCommand;
} : IExecuteProps<T>;
export interface IMenuItem {
    id: string;
    emoji: string;
    label: string;
    style: Exclude<MessageButtonStyleResolvable, 'LINK' | MessageButtonStyles.LINK>;
}
export {};
