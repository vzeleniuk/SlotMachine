import { COMBINATION_KEYS, LINES } from '../constants'

export interface Positions {
  top: number
  middle: number
  bottom: number
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

export interface CombinationData {
  combination: number[]
  line: LINES
  reward: number
  id: COMBINATION_KEYS
}