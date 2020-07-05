import * as React from 'react'

interface Props {
  disabled: boolean
  onClick: () => void
}

export const SpinButton = (props: Props) => {
  return (
    <button 
      aria-label='SPIN!' 
      id='spinButton' 
      disabled={props.disabled}
      onClick={props.onClick}>
    </button>
  )
}