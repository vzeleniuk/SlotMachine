import * as Helpers from '../helpers/Helpers'
import { CombinationData } from '../types'

export const iconHeight: number = 121
export const totalSymbols: number = 5
export const BetValue = 1
export const LowestBalanceValue = 1
export const HighestBalanceValue = 5000

export enum SYMBOLS {
  ONE_BAR,
  TWO_BAR,
  SEVEN,
  CHERRY,
  THREE_BAR
}

export enum LINES {
  TOP = 'Top',
  MIDDLE = 'Center',
  BOTTOM = 'Bottom',
  ANY = 'Any'
}

export const SymbolsOrder = [
  SYMBOLS.THREE_BAR, SYMBOLS.ONE_BAR, SYMBOLS.TWO_BAR, SYMBOLS.SEVEN, SYMBOLS.CHERRY
]

export const SymbolsOrderByPosition = [
  SYMBOLS.ONE_BAR, SYMBOLS.TWO_BAR, SYMBOLS.SEVEN, SYMBOLS.CHERRY, SYMBOLS.THREE_BAR
]

export const SymbolsOrderByPositionNumeric = SymbolsOrderByPosition.map(item => {
  let result = SymbolsOrderByPosition[item] * iconHeight
  return result === 0 ? result : -Math.abs(result) 
})

export const SymbolsImages = {
  [SymbolsOrderByPositionNumeric[SYMBOLS.ONE_BAR]]: '/BAR.png',
  [SymbolsOrderByPositionNumeric[SYMBOLS.TWO_BAR]]: '/2xBAR.png',
  [SymbolsOrderByPositionNumeric[SYMBOLS.THREE_BAR]]: '/3xBAR.png',
  [SymbolsOrderByPositionNumeric[SYMBOLS.SEVEN]]: '/7.png',
  [SymbolsOrderByPositionNumeric[SYMBOLS.CHERRY]]: '/Cherry.png',
}

export const Bars = [
  SymbolsOrderByPositionNumeric[SYMBOLS.ONE_BAR], 
  SymbolsOrderByPositionNumeric[SYMBOLS.TWO_BAR], 
  SymbolsOrderByPositionNumeric[SYMBOLS.THREE_BAR]
]

export enum COMBINATION_KEYS {
  CHERRIES_TOP = 'CHERRIES_TOP',
  CHERRIES_MIDDLE = 'CHERRIES_MIDDLE',
  CHERRIES_BOTTOM = 'CHERRIES_BOTTOM',
  SEVEN_ANY = 'SEVEN_ANY',
  CHERRY_SEVEN_ANY = 'CHERRY_SEVEN_ANY',
  THREE_BAR_ANY = 'THREE_BAR_ANY',
  TWO_BAR_ANY = 'TWO_BAR_ANY',
  ONE_BAR_ANY = 'ONE_BAR_ANY',
  BAR_ANY = 'BAR_ANY'
}

export const PayTableData: CombinationData[] = [
  {
    combination: Helpers.fillCombination(SYMBOLS.CHERRY),
    line: LINES.BOTTOM,
    reward: 4000,
    id: COMBINATION_KEYS.CHERRIES_BOTTOM
  },
  {
    combination: Helpers.fillCombination(SYMBOLS.CHERRY),
    line: LINES.TOP,
    reward: 2000,
    id: COMBINATION_KEYS.CHERRIES_TOP
  },
  {
    combination: Helpers.fillCombination(SYMBOLS.CHERRY),
    line: LINES.MIDDLE,
    reward: 1000,
    id: COMBINATION_KEYS.CHERRIES_MIDDLE
  },
  {
    combination: Helpers.fillCombination(SYMBOLS.SEVEN),
    line: LINES.ANY,
    reward: 150,
    id: COMBINATION_KEYS.SEVEN_ANY
  },
  {
    combination: [
      SymbolsOrderByPositionNumeric[SYMBOLS.SEVEN], 
      SymbolsOrderByPositionNumeric[SYMBOLS.CHERRY]],
    line: LINES.ANY,
    reward: 75,
    id: COMBINATION_KEYS.CHERRY_SEVEN_ANY
  },
  {
    combination: Helpers.fillCombination(SYMBOLS.THREE_BAR),
    line: LINES.ANY,
    reward: 50,
    id: COMBINATION_KEYS.THREE_BAR_ANY
  },
  {
    combination: Helpers.fillCombination(SYMBOLS.TWO_BAR),
    line: LINES.ANY,
    reward: 20,
    id: COMBINATION_KEYS.TWO_BAR_ANY
  },
  {
    combination: Helpers.fillCombination(SYMBOLS.ONE_BAR),
    line: LINES.ANY,
    reward: 10,
    id: COMBINATION_KEYS.ONE_BAR_ANY
  },
  {
    combination: Bars,
    line: LINES.ANY,
    reward: 5,
    id: COMBINATION_KEYS.BAR_ANY
  }
]