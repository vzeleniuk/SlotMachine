import * as React from 'react'

interface Props {
  disabled: boolean
  onClick: () => void
}

export const SpinButton = (props: Props) => {
  const renderInner = props.disabled ? <span className="spinner-border text-light" /> : 'SPIN'
  return (
    <button 
      className="spin-button btn btn-success"
      aria-label='SPIN!' 
      disabled={props.disabled}
      onClick={props.onClick}>
      {renderInner}
    </button>
  )
}