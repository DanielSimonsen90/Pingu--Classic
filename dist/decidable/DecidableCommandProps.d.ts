import { Giveaway, Poll, Suggestion, Theme } from './items';
export interface DecidableItems {
    Giveaway: Giveaway;
    Poll: Poll;
    Suggestion: Suggestion;
    Theme: Theme;
}
export declare type DecidablesTypes = keyof DecidableItems;
import { GiveawayConfig, PollConfig, SuggestionConfig, ThemeConfig } from "./config";
interface DecidableConfigs {
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
export declare function SetConfigObjects(config: DecidablesConfig): Map<IDecidableConfigOptions, ConfigKeys<any>>;
export declare const RegexUtil: {
    hasWinners: RegExp;
};
interface IDateFilter {
    before: Date;
    during: Date;
    after: Date;
}
interface ILimit {
    oldest: number;
    newest: number;
}
interface BaseIFilterOptions {
    date: IDateFilter;
    limit: ILimit;
}
import { GuildMember, Role, TextChannel } from 'discord.js';
interface IBy {
    hosted: GuildMember;
    won: GuildMember;
}
interface BaseIFilterOptionsWinnable extends BaseIFilterOptions {
    by: IBy;
    prize: string;
}
export declare type IFilterOptions<T extends DecidablesTypes> = T extends 'Giveaway' ? BaseIFilterOptionsWinnable : T extends 'Theme' ? BaseIFilterOptionsWinnable : BaseIFilterOptions;
interface IBaseSetupOptions {
    staffRole?: Role;
    channel?: TextChannel;
}
interface ISetupOptionsWinnable extends IBaseSetupOptions {
    winner?: Role;
    allowSameWinner: boolean;
}
interface IThemeSetupOptions extends ISetupOptionsWinnable {
    ignoreLastWins: boolean;
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
export declare type SubCommand<T extends DecidablesTypes> = 'setup' | 'list' | T;
export interface BaseExecuteProps<T extends DecidablesTypes> {
    type: T;
    command: SubCommand<T>;
    reactions: string[];
    config: DecidableConfigs[T];
    filter?: IFilterOptions<T>;
    setup?: ISetupOptions<T>;
    runOptions: IRunDecidable<T>;
}
export {};
