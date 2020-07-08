import * as React from 'react'
import { 
  LinesNames, 
  REEL, 
  MODE, 
  SymbolsNamesOrder, 
  SymbolsOrderByPositionNumeric, 
  ReelsOrder,
  SymbolsOrder,
} from '../constants'
import * as Helpers from '../helpers/Helpers'
import * as _ from 'lodash'

interface Props {
  onModeChoice: Function
  onCombinationChoice: Function
}

interface State {
  [REEL.FIRST]: [number | string, string ]
  [REEL.SECOND]: [number | string, string ]
  [REEL.THIRD]: [number | string, string ]
  mode: MODE,
  errors: string[]
}

class DebugArea extends React.Component<Props, State> {
  constructor(props: Props){
    super(props)
    this.state = {
      [REEL.FIRST]: ['', ''],
      [REEL.SECOND]: ['', ''],
      [REEL.THIRD]: ['', ''],
      mode: MODE.RANDOM,
      errors: []
    }

    this.toggleModeChoice = this.toggleModeChoice.bind(this)
    this.handleSymbolChoice = this.handleSymbolChoice.bind(this)
    this.handlePositionChoice = this.handlePositionChoice.bind(this)
    this.handleConfirm = this.handleConfirm.bind(this)
  }

  toggleModeChoice(event: React.ChangeEvent<HTMLInputElement>) {
    const mode = !Helpers.isFixedMode(event.target.value) ? MODE.FIXED : MODE.RANDOM
    this.setState({ mode })
    if (!Helpers.isFixedMode(mode)) {
      this.setState({ 
        [REEL.FIRST]: ['', ''],
        [REEL.SECOND]: ['', ''],
        [REEL.THIRD]: ['', ''],
      })  
    }
    this.props.onModeChoice(mode)
  }


  handleSymbolChoice(event: React.ChangeEvent<HTMLSelectElement>, reel: REEL) {
    this.setState({
      ...this.state,
      [reel]: [Number(event.target.value), this.state[reel][1]]
    })

    if (_.includes(this.state.errors, reel)) {
      this.setState({ errors: _.pull(this.state.errors, reel) })
    }
  }

  handlePositionChoice(event: React.ChangeEvent<HTMLSelectElement>, reel: REEL) {
    this.setState({
      ...this.state,
      [reel]: [this.state[reel][0], event.target.value]
    })

    if (_.includes(this.state.errors, reel)) {
      this.setState({ errors: _.pull(this.state.errors, reel) })
    }
  }

  handleConfirm() {
    let errors: string[] = []
    _.forEach(this.state, (value, key) => {
      if (_.includes(ReelsOrder, key)) {
        ((!value[0] && value[1]) || (value[0] && !value[1])) && errors.push(key)
      }
    })
    this.setState({ errors })

    if (errors.length === 0) {
      this.props.onCombinationChoice(
        _.pick(this.state, ReelsOrder)
      )
    }
  }

  generateSymbolsOptions() {
    let result: JSX.Element[] = []
    _.map(SymbolsOrder, (value) => {
      result.push(
        <option value={SymbolsOrderByPositionNumeric[value]} key={SymbolsNamesOrder[value]}>
          {SymbolsNamesOrder[value]}
        </option>
      )
    })

    result.unshift(
      <option value="" key="defaultSymbol">Choose a symbol</option>
    )
    return result
  }

  generatePositionOptions() {
    let result = LinesNames.map((line, index) => {
      return (
        <option value={line} key={line + index}>{line}</option>
      )
    })

    result.unshift(
      <option value="" key="defaultPosition">Choose a position</option>
    )
    return result
  }

  generateRows() {
    return ReelsOrder.map((reel, index) => {
      return (
        <tr key={reel + index} className={_.includes(this.state.errors, reel) ? 'is-incorrect' : ''}>
          <td>Reel {index + 1}</td>
          <td>
            <select 
              name={`symbols-${reel}`} 
              id={`symbols-${reel}`} 
              onChange={(event) => this.handleSymbolChoice(event, reel)}
              disabled={!Helpers.isFixedMode(this.state.mode)}
            >
              {this.generateSymbolsOptions()}
            </select>
          </td>
          <td>
            <select 
              name={`position-${reel}`}
              id={`position-${reel}`}
              onChange={(event) => this.handlePositionChoice(event, reel)}
              disabled={!Helpers.isFixedMode(this.state.mode)}
            >
              {this.generatePositionOptions()}
            </select>
          </td>
        </tr>
      )
    })
  }

  render() {
    return (
      <div className="debug-area-container">
        <div className="mode-choice-container">
          <p>Choose mode: {this.state.mode}</p>
          <label className="switch">
            <input 
              type="checkbox" 
              value={this.state.mode}
              onChange={event => this.toggleModeChoice(event)}
            />
            <span className="slider round"></span>
          </label>
        </div>
        <div className="debug-are-table-container">
          <table className="debug-area-table">
            <thead>
              <tr>
                <th>Reel</th>
                <th>Symbol</th>
                <th>Position</th>
              </tr>
            </thead>
            <tbody>
              {this.generateRows()}
            </tbody>
          </table>
          {this.state.errors.length > 0 && <p>Both or neither values should be provided</p>}
          <button
            type="submit"
            disabled={!Helpers.isFixedMode(this.state.mode)}
            onClick={() => this.handleConfirm()}
          >
            Confirm
          </button>
        </div>
      </div>
    )
  }
}

export default DebugArea