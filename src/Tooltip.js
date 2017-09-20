import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { graphite, text } from './styles/colors'

class Tooltip extends Component {
    constructor(props) {
        super(props)
        this.state = {
            triPosition: 0,
            shift: 0
        }
        this.displayMessage = this.displayMessage.bind(this)
    }

    componentDidMount() {
        const { coordinates } = this.props

        const d1 = coordinates.divWidth
        const d2 = document.getElementById('toolTip').getBoundingClientRect()
            .width
        this.setState({
            triPosition: (d2 - 11.31) / 2,
            shift: (d1 - d2) / 2
        })
    }

    displayMessage(message) {
        if (this.props.listView) {
            return (
                <div style={{
                    display:'flex',
                    flexDirection: 'column',
                    borderRadius: 3,
                    background: this.props.backgroundColor,
                    padding: 5
                }}
                id="toolTip"
                >
                {this.props.message.map(msg => 
                    <div
                        key={msg}
                        style={{
                            ...text,
                            background: this.props.backgroundColor,
                            color: 'white',
                            fontSize: 14,
                            borderRadius: 3,
                            fontFamily: 'Source Sans Pro',
                            padding: '7px 12px 7px 12px',
                            whiteSpace: 'nowrap',
                            
                        }}
                    >   
                        {msg}
                    </div>
                )}
                </div>
            )
           
        } else {
            return (
                <div
                id="toolTip"
                style={{
                    background: this.props.backgroundColor,
                    borderRadius: 3,
                    color: 'white',
                    fontSize: 12,
                    fontFamily: 'Source Sans Pro',
                    padding: '7px 12px 7px 12px',
                    textAlign: 'center',
                    whiteSpace: 'nowrap',
                    
                }}
            >   
                {this.props.message}
            </div>
            )
        }
    }

    render() {
        const { message, coordinates, backgroundColor, stylePosition, position, listView } = this.props
        let pos
        if (position !== null) {
            pos = position
        } else {
            if (
                document.getElementsByClassName('react-grid-Grid')[0].clientHeight -
                    coordinates.y <=
                35
            ) {
                pos = 'top'
            } else {
                pos = 'bottom'
            }
        }

        let res
        if (pos === 'top' && this.props.listView !== true) {
            res = (
                <div
                    style={{
                        position: stylePosition,
                        top: coordinates.y - 34 - 16,
                        left: coordinates.x + this.state.shift,
                        zIndex: 20
                    }}
                >
                    <div
                        id="toolTip"
                        style={{
                            background: backgroundColor,
                            borderRadius: 3,
                            color: 'white',
                            fontSize: 12,
                            fontFamily: 'Source Sans Pro',
                            padding: '0px 12px 7px 12px',
                            textAlign: 'center',
                            whiteSpace: 'nowrap'
                        }}
                    >
                        <div
                            style={{
                                height: 8,
                                width: 8,
                                backgroundColor: backgroundColor,
                                transform: 'rotate(45deg)',
                                position: 'relative',
                                left: this.state.triPosition,
                                top: 23
                            }}
                        />
                        {message}
                    </div>
                </div>
            )
        } else {
            res = (
                <div
                    style={{
                        position: stylePosition,
                        top: coordinates.y,
                        left: coordinates.x + this.state.shift,
                        zIndex: 20
                    }}
                >
                    <div
                        style={{
                            height: 8,
                            width: 8,
                            backgroundColor: backgroundColor,
                            transform: 'rotate(45deg)',
                            position: 'relative',
                            left: this.state.triPosition,
                            top: 5.655
                        }}
                    />
                    {this.displayMessage()}
                </div>
            )
        }
        return res
    }
}

Tooltip.propTypes = {
    coordinates: PropTypes.object.isRequired,
    stylePosition: PropTypes.string,
    backgroundColor: PropTypes.string,
    position: PropTypes.string,
}

Tooltip.defaultProps = {
    coordinates: {
        x: 0,
        y: 0,
        divWidth: 0
    },
    stylePosition: 'absolute',
    backgroundColor: graphite,
    position: null
}

export default Tooltip