import * as React from 'react'
import './App.css'
import { Reel, Balance, SpinButton, PayTable, DebugArea } from './components'
import * as Helpers from './helpers/Helpers'
import { MatchesPositions, Positions, CustomReels } from './types'
import { LINES, COMBINATION_KEYS, MODE, REEL } from './constants'

interface Props {}
interface State {
  winningCombination: COMBINATION_KEYS[] | null
  balance: number
  isSpinning: boolean
  isInitialSpin: boolean
  mode: MODE
  customReels: CustomReels | any
}

class App extends React.Component<Props, State> {
  static matches: MatchesPositions = {
    [LINES.TOP]: [],
    [LINES.MIDDLE]: [],
    [LINES.BOTTOM]: []
  }
  _child1: any
  _child2: any
  _child3: any

  constructor(props: Props) {
    super(props)
    
    this.state = {
      winningCombination: null,
      balance: 5000,
      isSpinning: false,
      isInitialSpin: true,
      mode: MODE.RANDOM,
      customReels: {}
    }
    this.finishHandler = this.finishHandler.bind(this)
    this.modeChoiceHandler = this.modeChoiceHandler.bind(this)
    this.combinationChoiceHandler = this.combinationChoiceHandler.bind(this)
    this.handleSpinButtonClick = this.handleSpinButtonClick.bind(this)
    this.handleBalanceChange = this.handleBalanceChange.bind(this)
    this.emptyMatches = this.emptyMatches.bind(this)
  }

  componentDidMount() {
    this.setState({ 
      isSpinning: true
    })
  }

  componentWillUnmount() {
    this.setState({
      winningCombination: null,
      balance: 5000,
      isSpinning: false,
      isInitialSpin: true,
      mode: MODE.RANDOM,
      customReels: {}
    })
  }

  handleSpinButtonClick() { 
    this.setState({ 
      isInitialSpin: false,
      winningCombination: null, 
      isSpinning: true,
      balance: Helpers.handleChangeTotalBalanceOnClick(this.state.balance)
    })
    this.emptyMatches()
    this._child1.forceUpdateHandler()
    this._child2.forceUpdateHandler()
    this._child3.forceUpdateHandler()
  }

  handleBalanceChange(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({balance: Helpers.handleChangeTotalBalanceOnChange(Number(event.target.value))})
  }

  modeChoiceHandler(mode: MODE) {
    this.setState({ mode })
  }

  combinationChoiceHandler(customReels: CustomReels) {
    this.setState({ customReels })
  }

  finishHandler(positions: Positions) {
    App.matches[LINES.TOP].push(positions[LINES.TOP])
    App.matches[LINES.MIDDLE].push(positions[LINES.MIDDLE])
    App.matches[LINES.BOTTOM].push(positions[LINES.BOTTOM])

    if (Helpers.areAllLinesComplete(App.matches)) {
      const { winningCombination } = this.state
      const combinationKeys: COMBINATION_KEYS[] = this.state.isInitialSpin ? [] : Helpers.verifyResult(App.matches)
      this.setState({ 
        winningCombination: combinationKeys, 
        isSpinning: false, 
        balance: Helpers.updateBalance(this.state.balance, combinationKeys)
      })
    }
  }

  emptyMatches() {
    App.matches = {
      [LINES.TOP]: [],
      [LINES.MIDDLE]: [],
      [LINES.BOTTOM]: []
    }
  }

  render() {
    console.log('matches: ', App.matches)
    const { winningCombination } = this.state
    console.log('winningCombination: ', winningCombination);
    return (
      <div className="App">
        <h1>
          Slot Machine
        </h1>

        <div className={`spinner-container ${winningCombination && winningCombination.length ? 'winner' : ''}`}>
          <Reel 
            onFinish={this.finishHandler} 
            ref={(child) => { this._child1 = child }} 
            timer={2000} 
            customPosition={Helpers.defineReelPosition(this.state.customReels, REEL.FIRST)}
          />
          <Reel 
            onFinish={this.finishHandler} 
            ref={(child) => { this._child2 = child }} 
            timer={2500} 
            customPosition={Helpers.defineReelPosition(this.state.customReels, REEL.SECOND)}
          />
          <Reel 
            onFinish={this.finishHandler} 
            ref={(child) => { this._child3 = child }} 
            timer={3000} 
            customPosition={Helpers.defineReelPosition(this.state.customReels, REEL.THIRD)}
          />
          <div className="gradient-fade" />
        </div>
        <SpinButton onClick={this.handleSpinButtonClick} disabled={this.state.isSpinning || this.state.balance === 0} />
        <Balance disabled={this.state.isSpinning} balance={this.state.balance} onChange={this.handleBalanceChange} />
        <PayTable winningCombination={winningCombination || []} />
        <DebugArea onModeChoice={this.modeChoiceHandler} onCombinationChoice={this.combinationChoiceHandler} />
      </div>
    )
  }
}

export default App
