import * as React from 'react'

interface Props {
  disabled: boolean
  balance: number
  onChange: Function
}

export const Balance = (props: Props) => {
  return (
    <div className='balance-container d-flex flex-row mb-4'>
      <div className="mr-3 input-balance">
        <label htmlFor="balance">Total Balance</label>
        <input 
          type="number" 
          id="balance"
          name="balance" 
          min={1}
          max={5000}
          placeholder="Enter 1-5000"
          autoComplete="off"
          onDrop={() => {return false}}
          disabled={props.disabled}
          value={props.balance}
          onChange={event => props.onChange(event)}
        />
      </div>
      <div className="input-bet">
        <label htmlFor="bet">Bet</label>
        <input 
          type="number" 
          id="bet"
          name="bet" 
          min={1}
          max={1}
          value="1"
          autoComplete="off"
          disabled={true}
        />
      </div>
    </div>
  )
}