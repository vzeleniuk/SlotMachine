import * as React from 'react'
import './App.css'
import { Reel, Balance, SpinButton, PayTable } from './components'
import * as Helpers from './helpers/Helpers'
import { MatchesPositions, Positions } from './types'
import { LINES, COMBINATION_KEYS } from './constants'

interface Props {}
interface State {
  winningCombination: COMBINATION_KEYS[] | null
  balance: number
  isSpinning: boolean
  isInitialSpin: boolean
}

class App extends React.Component<Props, State> {
  static matches: MatchesPositions = {
    [LINES.TOP]: [],
    [LINES.MIDDLE]: [],
    [LINES.BOTTOM]: []
  }

  static loser = [
    'Not quite', 
    'Stop gambling', 
    'Hey, you lost!', 
    'Ouch! I felt that',      
    'Don\'t beat yourself up',
    'There goes the college fund',
    'I have a cat. You have a loss',
    'You\'re awesome at losing',
    'Coding is hard',
    'Don\'t hate the coder'
  ]
  _child1: any
  _child2: any
  _child3: any

  constructor(props: Props) {
    super(props)
    
    this.state = {
      winningCombination: null,
      balance: 5000,
      isSpinning: false,
      isInitialSpin: true
    }
    this.finishHandler = this.finishHandler.bind(this)
    this.handleSpinButtonClick = this.handleSpinButtonClick.bind(this)
    this.handleBalanceChange = this.handleBalanceChange.bind(this)
    this.emptyMatches = this.emptyMatches.bind(this)
    this.getLoser = this.getLoser.bind(this)  
  }  

  componentDidMount() {
    this.setState({ 
      isSpinning: true
    })
  }

  handleSpinButtonClick() { 
    this.setState({ 
      isInitialSpin: this.state.isInitialSpin ? !this.state.isInitialSpin : this.state.isInitialSpin,
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

  finishHandler(positions: Positions) {
    App.matches[LINES.TOP].push(positions.top)
    App.matches[LINES.MIDDLE].push(positions.middle)
    App.matches[LINES.BOTTOM].push(positions.bottom)

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

  getLoser = () => {       
    return App.loser[Math.floor(Math.random()*App.loser.length)]
  }

  render() {
    console.log(App.matches)
    const { winningCombination } = this.state
    console.log('winningCombination: ', winningCombination);
    return (
      <div className="App">
        <h1>
          <span>{winningCombination === null ? 'Waiting…' : winningCombination.length ? '🤑 Pure skill! 🤑' : this.getLoser()}</span>
        </h1>

        <div className={`spinner-container ${winningCombination && winningCombination.length ? 'winner' : ''}`}>
          <Reel onFinish={this.finishHandler} ref={(child) => { this._child1 = child }} timer={2000} />
          <Reel onFinish={this.finishHandler} ref={(child) => { this._child2 = child }} timer={2500} />
          <Reel onFinish={this.finishHandler} ref={(child) => { this._child3 = child }} timer={3000} />
          <div className="gradient-fade" />
        </div>
        <SpinButton onClick={this.handleSpinButtonClick} disabled={this.state.isSpinning || this.state.balance === 0} />
        <Balance disabled={this.state.isSpinning} balance={this.state.balance} onChange={this.handleBalanceChange} />
        <PayTable winningCombination={winningCombination || []} />
      </div>
    )
  }
}

export default App
