import { ColorResolvable as BaseColorResolvable, HexColorString } from "discord.js"

type ExcludeFromBase = readonly [number, number, number] | number | HexColorString;
type ColorResolvable = Exclude<BaseColorResolvable, ExcludeFromBase>

class ColorResolvableClass implements Record<ColorResolvable, ColorResolvable> {
    DEFAULT: 'DEFAULT';
    WHITE: 'WHITE'
    AQUA: 'AQUA'
    GREEN: 'GREEN'
    BLUE: 'BLUE'
    YELLOW: 'YELLOW'
    PURPLE: 'PURPLE'
    LUMINOUS_VIVID_PINK: 'LUMINOUS_VIVID_PINK'
    FUCHSIA: 'FUCHSIA'
    GOLD: 'GOLD'
    ORANGE: 'ORANGE'
    RED: 'RED'
    GREY: 'GREY'
    DARKER_GREY: 'DARKER_GREY'
    NAVY: 'NAVY'
    DARK_AQUA: 'DARK_AQUA'
    DARK_GREEN: 'DARK_GREEN'
    DARK_BLUE: 'DARK_BLUE'
    DARK_PURPLE: 'DARK_PURPLE'
    DARK_VIVID_PINK: 'DARK_VIVID_PINK'
    DARK_GOLD: 'DARK_GOLD'
    DARK_ORANGE: 'DARK_ORANGE'
    DARK_RED: 'DARK_RED'
    DARK_GREY: 'DARK_GREY'
    LIGHT_GREY: 'LIGHT_GREY'
    DARK_NAVY: 'DARK_NAVY'
    BLURPLE: 'BLURPLE'
    GREYPLE: 'GREYPLE'
    DARK_BUT_NOT_BLACK: 'DARK_BUT_NOT_BLACK'
    NOT_QUITE_BLACK: 'NOT_QUITE_BLACK'
    RANDOM: 'RANDOM'
}
export const StaticColors = new ColorResolvableClass();
export const StaticColorsArray = Object.keys(new ColorResolvableClass())
export default ColorResolvableClass;