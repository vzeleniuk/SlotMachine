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
  WinningClass
} from '../constants'
import { MatchesPositions, CustomReels } from '../types'

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
  if (middleItemPosition === SYMBOLS.ONE_BAR) {
    return SymbolsOrderByPositionNumeric[SYMBOLS.THREE_BAR]
  }

  return SymbolsOrderByPositionNumeric[middleItemPosition - 1]
}

export const getBottomSymbol = (middleItem: number): number => {
  const middleItemPosition = _.indexOf(SymbolsOrderByPositionNumeric, middleItem)
  if (middleItemPosition === SYMBOLS.THREE_BAR) {
    return SymbolsOrderByPositionNumeric[SYMBOLS.ONE_BAR]
  }

  return SymbolsOrderByPositionNumeric[middleItemPosition + 1]
}

// Verification of spin results
export const verifyLine = (combinationDataLine: LINES, key: string): boolean => {
  if (combinationDataLine === LINES.ANY) {
    return true
  }
  return combinationDataLine === key
}

export const verifyThreeOfAKind = (matchers: MatchesPositions): any => {
  let winningCombinations: COMBINATION_KEYS[] = []
  let winningLine: string[] = []
  _.forEach(matchers, (value, key) => {
    PayTableData.find(combinationData => {
      _.isEqual(combinationData.combination, value) && 
      verifyLine(combinationData.line, key) && 
      winningCombinations.push(combinationData.id) && 
      winningLine.push(key)
    })
  })

  return { winningCombinations, winningLine }
}

export const verifyCherryAndSeven = (matchers: MatchesPositions): any => {
  let winningCombinations: COMBINATION_KEYS[] = []
  let winningLine: string[] = []
  _.forEach(matchers, (value, key) => {
    value.includes(SymbolsOrderByPositionNumeric[SYMBOLS.SEVEN]) && 
    value.includes(SymbolsOrderByPositionNumeric[SYMBOLS.CHERRY]) &&
    winningCombinations.push(COMBINATION_KEYS.CHERRY_SEVEN_ANY) && 
    winningLine.push(key)
  })
  return { winningCombinations, winningLine }
}

export const verifyAnyBarCombination = (matchers: MatchesPositions): any => {
  let winningCombinations: COMBINATION_KEYS[] = []
  let winningLine: string[] = []
  _.forEach(matchers, (value, key) => {
    (value.every(el => Bars.includes(el)) && !(value[0] === value[1] && value[0] === value[2])) &&
    winningCombinations.push(COMBINATION_KEYS.BAR_ANY) &&
    winningLine.push(key)
  })
  return { winningCombinations, winningLine }
}

export const verifyResult = (matchers: MatchesPositions): any => {
  let winningCombinations: COMBINATION_KEYS[][] = []
  const threeOfAKind = verifyThreeOfAKind(matchers)
  const cherryAndSeven = verifyCherryAndSeven(matchers)
  const anyBar = verifyAnyBarCombination(matchers)
  winningCombinations.push(threeOfAKind.winningCombinations)
  winningCombinations.push(cherryAndSeven.winningCombinations)
  winningCombinations.push(anyBar.winningCombinations)
  let winningLines: string[] = []
  winningLines.push(threeOfAKind.winningLine)
  winningLines.push(cherryAndSeven.winningLine)
  winningLines.push(anyBar.winningLine)

  let result = { 
    winningCombinations: _.flatten(winningCombinations), 
    winningLines: _.flatten(winningLines) 
  }
  return result
}

export const defineReward = (winningCombinationKey: COMBINATION_KEYS): number => {
  if (!winningCombinationKey) { return 0 }
  return PayTableData.find(combinationData => combinationData.id === winningCombinationKey)!.reward
}

export const updateBalance = (balance: number, winningCombinationKeys: COMBINATION_KEYS[]): number => {
  const reward = winningCombinationKeys.map(key => defineReward(key))
  return !!reward.length ? balance + _.sum(reward) : balance
}

export const getWinningClass = (winningLines: LINES[]): string[] => {
  if (_.isEmpty(winningLines)) { return [] }
  return _.map(winningLines, (value) => {
    if (value) {
      return WinningClass[value]
      
    } else {
      return ''
    }
  })
}

export const getClassesForSpinnerContainer = (winningCombination: COMBINATION_KEYS[] | null, winningLines: LINES[]): string => {
  return `spinner-container ${winningCombination && winningCombination.length ? getWinningClass(winningLines).join(' ') : ''}`
}


// Custom reels
export const defineReelPosition = (customReels: CustomReels, reel: REEL) => {
  if (!customReels) {return null}
  const currentReelValue = customReels[reel]
  if (!currentReelValue) {return null}
  if (!currentReelValue[0] && !currentReelValue[1]) { return null }

  return {[currentReelValue[1]]: currentReelValue[0]}
}

export const A2HS = () => {
  // Code to handle install prompt on desktop
  let deferredPrompt: Event | null;
  const addBtn = document.querySelector('#add-button');
  // @ts-ignore 
  addBtn!.style.display = 'none';

  window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent Chrome 67 and earlier from automatically showing the prompt
    e.preventDefault();
    // Stash the event so it can be triggered later.
    deferredPrompt = e;
    // Update UI to notify the user they can add to home screen
    // @ts-ignore 
    addBtn!.style.display = 'block';

    addBtn!.addEventListener('click', (e) => {
      // hide our user interface that shows our A2HS button
      // @ts-ignore 
      addBtn!.style.display = 'none';
      // Show the prompt
      // @ts-ignore 
      deferredPrompt!.prompt();
      // Wait for the user to respond to the prompt
      // @ts-ignore 
      deferredPrompt!.userChoice.then((choiceResult: { outcome: string }) => {
          if (choiceResult.outcome === 'accepted') {
            console.log('User accepted the A2HS prompt');
          } else {
            console.log('User dismissed the A2HS prompt');
          }
          deferredPrompt = null;
        });
    });
  });
}