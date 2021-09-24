import { Giveaway, Poll, Suggestion, Theme } from './items'
export interface DecidableItems {
    Giveaway: Giveaway,
    Poll: Poll,
    Suggestion: Suggestion,
    Theme: Theme
}
export type DecidablesTypes = keyof DecidableItems;

import { GiveawayConfig, PollConfig, SuggestionConfig, ThemeConfig } from "./config";
interface DecidableConfigs {
    Giveaway: GiveawayConfig,
    Poll: PollConfig,
    Suggestion: SuggestionConfig,
    Theme: ThemeConfig
}

import { ExecuteFunctionProps } from "../pingu/handlers/Command/PinguCommandBase";
import { CommandParams } from "../pingu/handlers/Pingu/PinguCommand";
export interface DecidablesParams<T extends DecidablesTypes> {
    executeProps: ExecuteFunctionProps & CommandParams & BaseExecuteProps<T>
}

import IDecidableConfigOptions from './interfaces/IDecidableConfigOptions';
import PRole from '../database/json/PRole';
import Decidable from './items/Decidable';
export interface ConfigKeys<T extends DecidablesTypes> extends IDecidableConfigOptions {
    hostRole: PRole,
    collection: DecidableItems[T][],
    staffRoleType: string
    winnerRole?: PRole,
    constructor: typeof Decidable,
    allowSameWinner?: boolean,
    ignoreLastWins?: number,
}

import DecidablesConfig from './config/DecidablesConfig';
export function SetConfigObjects(config: DecidablesConfig) {
    const { giveawayConfig, pollConfig, suggestionConfig, themeConfig } = config;
    
    const giveawayObj = {
        constructor: Giveaway,
        firstTimeExecuted: giveawayConfig.firstTimeExecuted,
        channel: giveawayConfig.channel,
        hostRole: giveawayConfig.hostRole,
        winnerRole: giveawayConfig.winnerRole,
        collection: giveawayConfig.giveaways,
        allowSameWinner: giveawayConfig.allowSameWinner,
        staffRoleType: 'Giveaway Host'
    } as ConfigKeys<'Giveaway'>;
    const pollObj = {
        constructor: Poll,
        firstTimeExecuted: pollConfig.firstTimeExecuted,
        channel: pollConfig.channel,
        hostRole: pollConfig.pollRole,
        collection: pollConfig.polls,
        staffRoleType: 'Poll Host'
    } as ConfigKeys<'Poll'>;
    const suggestionsObj = {
        constructor: Suggestion,
        firstTimeExecuted: suggestionConfig.firstTimeExecuted,
        channel: suggestionConfig.channel,
        hostRole: suggestionConfig.managerRole,
        collection: suggestionConfig.suggestions,
        staffRoleType: 'Suggestion Manager'
    } as ConfigKeys<'Suggestion'>;
    const themeMap = {
        constructor: Theme,
        firstTimeExecuted: themeConfig.firstTimeExecuted,
        channel: themeConfig.channel,
        winnerRole: themeConfig.winnerRole,
        hostRole: themeConfig.hostRole,
        collection: themeConfig.themes,
        allowSameWinner: themeConfig.allowSameWinner,
        ignoreLastWins: themeConfig.ignoreLastWins,
        staffRoleType: 'Theme Host'
    } as ConfigKeys<'Theme'>;

    return new Map<IDecidableConfigOptions, ConfigKeys<any>>([
        [giveawayConfig, giveawayObj],
        [pollConfig, pollObj],
        [suggestionConfig, suggestionsObj],
        [themeConfig, themeMap]
    ]);
}

export const RegexUtil = {
    hasWinners: /^\d{1,}w$/
}

interface IDateFilter {
    before: Date,
    during: Date,
    after: Date
}
interface ILimit {
    oldest: number,
    newest: number
}
interface BaseIFilterOptions {
    date: IDateFilter,
    limit: ILimit
}

import { GuildMember, Role, TextChannel } from 'discord.js';
interface IBy {
    hosted: GuildMember,
    won: GuildMember,
}
interface BaseIFilterOptionsWinnable extends BaseIFilterOptions {
    by: IBy,
    prize: string
}
export type IFilterOptions<T extends DecidablesTypes> = 
    T extends 'Giveaway' ? BaseIFilterOptionsWinnable :
    T extends 'Theme' ? BaseIFilterOptionsWinnable :
    BaseIFilterOptions
;

interface IBaseSetupOptions {
    staffRole?: Role,
    channel?: TextChannel
}
interface ISetupOptionsWinnable extends IBaseSetupOptions {
    winner?: Role,
    allowSameWinner: boolean
}
interface IThemeSetupOptions extends ISetupOptionsWinnable {
    ignoreLastWins: boolean
}
export type ISetupOptions<T extends DecidablesTypes> = 
    T extends 'Theme' ? IThemeSetupOptions :
    T extends 'Giveaway' ? ISetupOptionsWinnable :
    IBaseSetupOptions
;

export interface IValueable { value: string }
export interface IValueTime extends IValueable { time: string }
export interface IRunDecidableWinnable extends IValueTime { 
    channel: TextChannel,
    winners: number,
    allowSameWinner: boolean
}
export interface IRunTheme extends IRunDecidableWinnable {
    ignoreLastWins: number
}

export type IRunDecidable<T extends DecidablesTypes> = 
    T extends 'Suggestion' ? IValueable :
    T extends 'Poll' ? IValueTime :
    T extends 'Giveaway' ? IRunDecidableWinnable :
    IRunTheme
;

export type SubCommand<T extends DecidablesTypes> = 'setup' | 'list' | T
export interface BaseExecuteProps<T extends DecidablesTypes> {
    type: T,
    command: SubCommand<T>,
    reactions: string[],
    config: DecidableConfigs[T],
    filter?: IFilterOptions<T>,
    setup?: ISetupOptions<T>,
    runOptions: IRunDecidable<T>
}