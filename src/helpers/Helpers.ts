import * as _ from 'lodash'
import { 
  SYMBOLS,
  COMBINATION_KEYS,
  LINES,
  MODE,
  Bars,
  SymbolsOrderByPositionNumeric, 
  BetValue, 
  LowestBalanceValue, 
  HighestBalanceValue,
  PayTableData,
  REEL,
} from '../constants'
import { MatchesPositions, WinningCombinationByLine, CustomReels } from '../types'

export const isFixedMode = (mode: MODE | string): boolean => {
  return mode === MODE.FIXED
}

export const fillCombination = (icon: SYMBOLS) => {
  const result: number[] = [0, 0, 0]
  return result.fill(SymbolsOrderByPositionNumeric[icon], 0, 3)
}

export const handleChangeTotalBalanceOnClick = (totalBalance: number): number => {
  return totalBalance - BetValue > 0 ? totalBalance - BetValue : 0
}

export const handleChangeTotalBalanceOnChange = (totalBalance: number): number => {
  if (totalBalance > 0 && totalBalance <= HighestBalanceValue) {
    return totalBalance
  }

  if (totalBalance > HighestBalanceValue) {
    return HighestBalanceValue
  }

  if (totalBalance <= 0) {
    return LowestBalanceValue
  }
  return totalBalance
}

export const areAllLinesComplete = (matchers: MatchesPositions): boolean => {
  return Object.values(matchers).every(value => value.length === 3)
}

export const getTopSymbol = (middleItem: number): number => {
  const middleItemPosition = _.indexOf(SymbolsOrderByPositionNumeric, middleItem)
  if (middleItemPosition === SymbolsOrderByPositionNumeric[SYMBOLS.ONE_BAR]) {
    return SymbolsOrderByPositionNumeric[SYMBOLS.THREE_BAR]
  }

  return SymbolsOrderByPositionNumeric[middleItemPosition - 1]
}

export const getBottomSymbol = (middleItem: number): number => {
  const middleItemPosition = _.indexOf(SymbolsOrderByPositionNumeric, middleItem)
  if (middleItemPosition === SymbolsOrderByPositionNumeric[SYMBOLS.THREE_BAR]) {
    return SymbolsOrderByPositionNumeric[SYMBOLS.ONE_BAR]
  }

  return SymbolsOrderByPositionNumeric[middleItemPosition + 1]
}

// Verification of the spin results
export const verifyLine = (combinationDataLine: LINES, key: string): boolean => {
  if (combinationDataLine === LINES.ANY) {
    return true
  }
  return combinationDataLine === key
}

export const verifyThreeOfAKind = (matchers: MatchesPositions): COMBINATION_KEYS[] => {
  let winningCombinations: COMBINATION_KEYS[] = []
  _.forEach(matchers, (value, key) => {
    const winningCombination = PayTableData.find(combinationData => {
      _.isEqual(combinationData.combination, value) && verifyLine(combinationData.line, key)
    })
    winningCombination && winningCombinations.push(winningCombination.id)
  })

  return winningCombinations
}

export const verifyCherryAndSeven = (matchers: MatchesPositions): COMBINATION_KEYS[] => {
  let winningCombinations: COMBINATION_KEYS[] = []
  _.forEach(matchers, (value, key) => {
    value.includes(SymbolsOrderByPositionNumeric[SYMBOLS.SEVEN]) && 
    value.includes(SymbolsOrderByPositionNumeric[SYMBOLS.CHERRY]) &&
    winningCombinations.push(COMBINATION_KEYS.CHERRY_SEVEN_ANY)
  })
  return winningCombinations
}

export const verifyAnyBarCombination = (matchers: MatchesPositions): COMBINATION_KEYS[] => {
  let winningCombinations: COMBINATION_KEYS[] = []
  _.forEach(matchers, (value, key) => {
    value.every(el => Bars.includes(el)) &&
    winningCombinations.push(COMBINATION_KEYS.BAR_ANY)
    
  })
  return winningCombinations
}

export const verifyResult = (matchers: MatchesPositions): COMBINATION_KEYS[] => {
  let result: COMBINATION_KEYS[][] = []
  result.push(verifyThreeOfAKind(matchers))
  result.push(verifyCherryAndSeven(matchers))
  result.push(verifyAnyBarCombination(matchers))
  return _.flatten(result)
}

export const defineReward = (winningCombinationKey: COMBINATION_KEYS): number => {
  if (!winningCombinationKey) { return 0 }
  return PayTableData.find(combinationData => combinationData.id === winningCombinationKey)!.reward
}

export const updateBalance = (balance: number, winningCombinationKeys: COMBINATION_KEYS[]): number => {
  const reward = winningCombinationKeys.map(key => defineReward(key))
  return !!reward.length ? balance + _.sum(reward) : balance
}

// Custom reels
export const defineReelPosition = (customReels: CustomReels, reel: REEL) => {
  if (!customReels) {return null}
  const currentReelValue = customReels[reel]
  if (!currentReelValue) {return null}
  if (!currentReelValue[0] && !currentReelValue[1]) { return null }

  return {[currentReelValue[1]]: currentReelValue[0]}
}