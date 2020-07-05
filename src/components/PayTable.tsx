import * as React from 'react'
import { uniq, includes } from 'lodash'
import { PayTableData, SymbolsImages, COMBINATION_KEYS } from '../constants'
import { CombinationData } from '../types'

interface CombinationCellProps {
  combinationIndex: number
}

interface TableRowProps {
  combinationData: CombinationData
  combinationDataIndex: number
  winningCombination: COMBINATION_KEYS[]
}

interface Props {
  winningCombination: COMBINATION_KEYS[]
}

const CombinationCell: React.StatelessComponent<CombinationCellProps> = (props: CombinationCellProps):JSX.Element => {
  const images = PayTableData[props.combinationIndex].combination.map((image, index) => {
    return  <img src={SymbolsImages[image]} height="40" key={SymbolsImages[image] + props.combinationIndex + index}/>
  })
  return (
    <td>
      {images}
    </td>
  )
}

const TableRow: React.StatelessComponent<TableRowProps> = (props: TableRowProps): JSX.Element => {
  return (
    <tr 
      id={props.combinationData.id}
      className={`${includes(props.winningCombination, props.combinationData.id) ? 'winning-row' : ''}`}
    >
      <CombinationCell combinationIndex={props.combinationDataIndex} />
      <td>{PayTableData[props.combinationDataIndex].line}</td>
      <td>{PayTableData[props.combinationDataIndex].reward}</td>
    </tr>
  )
}

export const PayTable: React.StatelessComponent<Props> = (props: Props): JSX.Element => {
  const winningKeys = uniq(props.winningCombination)
  return (
    <div className="pay-table-container">
      <h1>Pay Table</h1>
      <table>
        <thead>
          <tr>
            <th>Combination</th>
            <th>Line</th>
            <th>Reward</th>
          </tr>
        </thead>
        <tbody>
          {PayTableData.map((combinationData, index) => (
            <TableRow
              key={combinationData.id}
              combinationData={combinationData} 
              combinationDataIndex={index} 
              winningCombination={winningKeys}
            />
          ))}
        </tbody>
      </table>
    </div>
  )
}