import { COMBINATION_KEYS, LINES, REEL } from '../constants'

export interface Positions {
  [LINES.TOP]: number
  [LINES.MIDDLE]: number
  [LINES.BOTTOM]: number
}

export interface MatchesPositions {
  [LINES.TOP]: number[]
  [LINES.MIDDLE]: number[]
  [LINES.BOTTOM]: number[]
}

export interface WinningCombinationByLine {
  [LINES.TOP]: string | null
  [LINES.MIDDLE]: string | null
  [LINES.BOTTOM]: string | null
}

export interface CustomReels {
  [REEL.FIRST]: [number | string, string ]
  [REEL.SECOND]: [number | string, string ]
  [REEL.THIRD]: [number | string, string ]
}

export interface CombinationData {
  combination: number[]
  line: LINES
  reward: number
  id: COMBINATION_KEYS
}