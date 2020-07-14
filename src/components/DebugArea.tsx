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
  mode: MODE
  errors: string[]
  isConfirmed: boolean
}

class DebugArea extends React.Component<Props, State> {
  constructor(props: Props){
    super(props)
    this.state = {
      [REEL.FIRST]: ['', ''],
      [REEL.SECOND]: ['', ''],
      [REEL.THIRD]: ['', ''],
      mode: MODE.RANDOM,
      errors: [],
      isConfirmed: false
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
        isConfirmed: false,
        errors: []
      })
    }
    this.props.onModeChoice(mode)
  }


  handleSymbolChoice(event: React.ChangeEvent<HTMLSelectElement>, reel: REEL) {
    const value = event.target.value ? event.target.value : ''
    this.setState({
      ...this.state,
      isConfirmed: false,
      [reel]: [value, this.state[reel][1]]
    })

    if (_.includes(this.state.errors, reel)) {
      this.setState({ errors: _.pull(this.state.errors, reel) })
    }
  }

  handlePositionChoice(event: React.ChangeEvent<HTMLSelectElement>, reel: REEL) {
    const value = event.target.value ? event.target.value : ''
    this.setState({
      ...this.state,
      isConfirmed: false,
      [reel]: [this.state[reel][0], value]
    })

    if (_.includes(this.state.errors, reel)) {
      this.setState({ errors: _.pull(this.state.errors, reel) })
    }
  }

  handleConfirm() {
    let errors: string[] = []
    _.forEach(this.state, (value, key) => {
      if (_.isArray(value) && _.includes(ReelsOrder, key)) {
        ((!value[0] && value[1]) || (value[0] && !value[1])) && errors.push(key)
      }
    })
    this.setState({ errors })

    if (errors.length === 0) {
      this.setState({ isConfirmed: true })
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
      <option value="" key="defaultSymbol">- - -</option>
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
      <option value="" key="defaultPosition">- - -</option>
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
              value={this.state[reel][0]}
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
              value={this.state[reel][1]}
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
        <div className="mode-choice-container d-flex flex-row my-3">
          <label className="switch mb-0">
            <input 
              type="checkbox" 
              value={this.state.mode}
              onChange={event => this.toggleModeChoice(event)}
            />
            <span className="slider round"></span>
          </label>
          <p className="mb-0 ml-2">Mode: {this.state.mode}</p>
        </div>
        <div className="debug-area-table-container">
          <div className="debug-area-table-with-errors">
            <table className="debug-area-table w-100 mb-1">
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
            {this.state.errors.length > 0 ? <p className="error-message mb-1">Both or neither values should be provided</p> : <div className="placeholder" />}
          </div>
          {this.state.isConfirmed && <p className="mb-0 text-success d-inline-block confirmation-message">Changes applied &#10003;</p>}
          <button
            type="submit"
            className="btn btn-light float-right"
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