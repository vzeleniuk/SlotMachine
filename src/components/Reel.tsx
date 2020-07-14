import * as React from 'react'
import { iconHeight, totalSymbols, LINES } from '../constants'
import * as Helpers from '../helpers/Helpers'

interface Props {
  onFinish: Function
  timer: number
  customPosition: any | null
}

interface State {
  position: number
  customPosition: any | null
  lastPosition: number | null
  timeRemaining: number
}

class Reel extends React.Component<Props, State> {  
  static multiplier: number = Math.floor(Math.random() * (4 - 1) + 1)
  static speed = iconHeight * Reel.multiplier 
  start = this.setStartPosition()
  timer = setInterval(() => {
    this.tick()
  }, 100)

  constructor(props: Props){
    super(props)
    this.state = {
      position: 0,
      customPosition: null,
      lastPosition: null,
      timeRemaining: 0
    }

    this.forceUpdateHandler = this.forceUpdateHandler.bind(this)
    this.reset = this.reset.bind(this)
    this.tick = this.tick.bind(this)
    this.setStartPosition = this.setStartPosition.bind(this)
    this.moveBackground = this.moveBackground.bind(this)
    this.getSymbolFromPosition = this.getSymbolFromPosition.bind(this)

  }  

  componentDidMount() {
    clearInterval(this.timer)

    this.setState({
      position: this.start,
      timeRemaining: this.props.timer,
      customPosition: this.props.customPosition
    })

    this.timer = setInterval(() => {
      this.tick()
    }, 100)
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.customPosition !== this.props.customPosition) {
      this.setState({
        customPosition: this.props.customPosition
      })
    }
  }

  componentWillUnmount() {
    this.setState({
      position: 0,
      customPosition: null,
      lastPosition: null,
      timeRemaining: 0
    })
  }

  forceUpdateHandler() {
    this.reset()
  } 

  reset() {
    if (this.timer) { 
      clearInterval(this.timer) 
    }  

    this.start = this.setStartPosition()

    this.setState({
      position: this.start,
      timeRemaining: this.props.timer        
    })

    this.timer = setInterval(() => {
      this.tick()
    }, 100)      
  }
  
  setStartPosition() {
    return ((Math.floor((Math.random() * totalSymbols))) * iconHeight) * -1
  }

  moveBackground() {
    this.setState({ 
      position: this.state.position - Reel.speed,
      timeRemaining: (this.state.timeRemaining || 100) - 100
    })
  }

  getSymbolFromPosition() {
    let { position } = this.state
    
    const maxPosition = (iconHeight * (totalSymbols - 1) * -1)
    let moved = (this.props.timer / 100) * Reel.multiplier
    let startPosition = this.start
    let currentPosition = startPosition    

    for (let i = 0; i < moved; i++) {              
      currentPosition -= iconHeight

      if (currentPosition < maxPosition) {
        currentPosition = 0
      }      
    }
    let result = {
      [LINES.TOP]: Helpers.getTopSymbol(currentPosition),
      [LINES.MIDDLE]: currentPosition, 
      [LINES.BOTTOM]: Helpers.getBottomSymbol(currentPosition)
    }

    this.props.onFinish(result)
  }

  tick() {      
    if (this.state.timeRemaining <= 0) {
      clearInterval(this.timer)        
      this.getSymbolFromPosition()    
    } else {
      this.moveBackground()
    }      
  }

  render() {
    let { position, ...rest } = this.state

    return (            
      <div 
        style={{backgroundPosition: '0px ' + position + 'px'}}
        className="icons"
      />
    )
  }
}

export default Reel