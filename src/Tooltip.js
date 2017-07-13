import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { graphite } from './styles/colors'

class Tooltip extends Component {
    constructor(props) {
        super(props)
        this.state = {
            triPosition: 0,
            shift: 0
        }
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

    render() {
        const { message, coordinates } = this.props
        let position
        if (
            document.getElementsByClassName('react-grid-Grid')[0].clientHeight -
                coordinates.y <=
            35
        ) {
            position = 'top'
        } else {
            position = 'bottom'
        }

        let res
        if (position === 'top') {
            res = (
                <div
                    style={{
                        position: 'absolute',
                        top: coordinates.y - 34 - 16,
                        left: coordinates.x + this.state.shift,
                        zIndex: 20
                    }}
                >
                    <div
                        id="toolTip"
                        style={{
                            background: graphite,
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
                                backgroundColor: graphite,
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
                        position: 'absolute',
                        top: coordinates.y,
                        left: coordinates.x + this.state.shift,
                        zIndex: 20
                    }}
                >
                    <div
                        style={{
                            height: 8,
                            width: 8,
                            backgroundColor: graphite,
                            transform: 'rotate(45deg)',
                            position: 'relative',
                            left: this.state.triPosition,
                            top: 5.655
                        }}
                    />
                    <div
                        id="toolTip"
                        style={{
                            background: graphite,
                            borderRadius: 3,
                            color: 'white',
                            fontSize: 12,
                            fontFamily: 'Source Sans Pro',
                            padding: '7px 12px 7px 12px',
                            textAlign: 'center',
                            whiteSpace: 'nowrap'
                        }}
                    >
                        {message}
                    </div>
                </div>
            )
        }
        return res
    }
}

Tooltip.propTypes = {
    message: PropTypes.string.isRequired,
    coordinates: PropTypes.object.isRequired
}

Tooltip.defaultProps = {
    message: '',
    coordinates: {
        x: 0,
        y: 0,
        divWidth: 0
    }
}

export default Tooltip
