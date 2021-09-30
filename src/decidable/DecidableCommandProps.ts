//#region Config & Items
import { Giveaway, Poll, Suggestion, Theme } from './items';
export interface DecidableItems {
    Giveaway: Giveaway,
    Poll: Poll,
    Suggestion: Suggestion,
    Theme: Theme
}
export type DecidablesTypes = keyof DecidableItems;
export type GiveawayTypes = Exclude<DecidablesTypes, 'Poll'> & Exclude<DecidablesTypes, 'Suggestion'>;

import { GiveawayConfig, PollConfig, SuggestionConfig, ThemeConfig } from "./config";
export interface DecidableConfigs {
    Giveaway: GiveawayConfig,
    Poll: PollConfig,
    Suggestion: SuggestionConfig,
    Theme: ThemeConfig
}
//#endregion

//#region Execute
import { ExecuteFunctionProps } from "../pingu/handlers/Command/PinguCommandBase";
import { CommandParams } from "../pingu/handlers/Pingu/PinguCommand";
export interface DecidablesParams<T extends DecidablesTypes> {
    executeProps: ExecuteFunctionProps & CommandParams & BaseExecuteProps<T>
}
//#endregion

//#region Config
import IDecidableConfigOptions from './interfaces/IDecidableConfigOptions';
import PRole from '../database/json/PRole';
import Decidable, { ApproveTypes } from './items/Decidable';
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
    const themeObj = {
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

    return new Map<IDecidableConfigOptions, ConfigKeys<DecidablesTypes>>([
        [giveawayConfig, giveawayObj],
        [pollConfig, pollObj],
        [suggestionConfig, suggestionsObj],
        [themeConfig, themeObj]
    ]);
}
//#endregion

//#region Filter
export interface IDateFilter {
    before: Date,
    during: Date,
    after: Date
}
export interface ILimit {
    oldest: number,
    newest: number
}

import { GuildMember, MessageButtonStyleResolvable, Role, TextChannel } from 'discord.js';
import { MessageButtonStyles } from 'discord.js/typings/enums';
export interface IBySuggestion { suggested: GuildMember, decided: GuildMember }
export interface IByPoll { asked: GuildMember }
export interface IByGiveaway { hosted: GuildMember, won: GuildMember, }
export type IBy<T extends DecidablesTypes> =
    T extends 'Poll' ? IByPoll :
    T extends 'Suggestion' ? IBySuggestion :
    IByGiveaway

export interface IBaseFilterOptions<T extends DecidablesTypes> {
    date: IDateFilter,
    limit: ILimit,
    value: string,
    by: IBy<T>,
    from: TextChannel
}
export interface IFilterOptionsDecidable<T extends Exclude<DecidablesTypes, GiveawayTypes>> extends IBaseFilterOptions<T> {
    decision: ApproveTypes
}
export type IFilterOptions<T extends DecidablesTypes> = T extends Exclude<DecidablesTypes, GiveawayTypes> ? IFilterOptionsDecidable<T> : IBaseFilterOptions<T>
//#endregion

//#region Setup
export interface IBaseSetupOptions {
    staffRole?: Role,
    channel?: TextChannel
}
export interface ISetupOptionsWinnable extends IBaseSetupOptions {
    winner?: Role,
    allowSameWinner?: boolean
}
export interface IThemeSetupOptions extends ISetupOptionsWinnable {
    ignoreLastWins?: number
}
export type ISetupOptions<T extends DecidablesTypes> = 
    T extends 'Theme' ? IThemeSetupOptions :
    T extends 'Giveaway' ? ISetupOptionsWinnable :
    IBaseSetupOptions
;
//#endregion

//#region Execute options
export interface IValueable { value: string, channel: TextChannel }
export interface IValueTime extends IValueable { time: string }
export interface IRunDecidableWinnable extends IValueTime { 
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
//#endregion

//#region Sub Command
type SubCommandBase<T extends DecidablesTypes> = 'setup' | 'list' | T;
type SubCommandReroll<T extends DecidablesTypes> = SubCommandBase<T> | 'reroll';
type SubCommandTheme = SubCommandReroll<'Theme'> | 'reset';
export type SubCommand<T extends DecidablesTypes> = 
    T extends 'Giveaway' ? SubCommandReroll<T> : 
    T extends 'Theme' ? SubCommandTheme : 
    SubCommandBase<T>
;
//#endregion

interface IExecuteProps<T extends DecidablesTypes> {
    type: T,
    command: SubCommand<T>,
    config: DecidableConfigs[T],
    reactions?: string[],
    filter?: IFilterOptions<T>,
    setup?: ISetupOptions<T>,
    runOptions?: IRunDecidable<T>
}
export type ResetSubCommand = 'channels' | 'roles' | 'general';
export type BaseExecuteProps<T extends DecidablesTypes> = 
    T extends 'Theme' ? IExecuteProps<T> & { resetOnly: ResetSubCommand } : IExecuteProps<T>

export interface IMenuItem {
    id: string;
    emoji: string;
    label: string;
    style: Exclude<MessageButtonStyleResolvable, 'LINK' | MessageButtonStyles.LINK>;
}