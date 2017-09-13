import React, { Component } from 'react'
import PropTypes from 'prop-types'

import {
    text,
    light,
    orchid,
    AddButton,
    lavender,
    steel,
    graphite,
    ash
} from '@rover/react-bootstrap'

class AddTag extends Component {
    constructor(props) {
        super(props)
        this.state = {
            top: 0,
            left: 0,
            addFilter: {
                button: orchid,
                text: lavender,
                background: graphite
            }
        }
        this.updateAddFilterColors = this.updateAddFilterColors.bind(this)
        this.handleOnClick = this.handleOnClick.bind(this)
    }

    componentDidMount() {
        let { left, top } = document
            .getElementById('reactPillTextField')
            .getBoundingClientRect()
        let container = document
            .getElementById('stringArrayInputContainer')
            .getBoundingClientRect()

        let leftContainer = container.left
        let topContainer = container.top
        this.setState({
            top: top - topContainer + 110,
            left: left - 20 + 145 >= 420 ? 272 : left - 20
        })
    }

    updateAddFilterColors(val) {
        if (val === 'over') {
            this.setState({
                addFilter: {
                    button: 'white',
                    text: 'white',
                    background: ash
                }
            })
        } else if (val === 'leave') {
            this.setState({
                addFilter: {
                    button: orchid,
                    text: lavender,
                    background: graphite
                }
            })
        }
    }

    handleOnClick() {
        this.props.updateTags(this.props.text, 'add', null)
        this.props.reset()
    }

    render() {
        const { top, left, addFilter } = this.state
        const { text } = this.props
        return (
            <div
                style={{
                    position: 'absolute',
                    top: top,
                    left: left,
                    width: 145,
                    height: 45,
                    borderStyle: 'solid',
                    borderWidth: '1px',
                    borderColor: steel,
                    display: 'flex',
                    alignItems: 'center',
                    background: addFilter.background
                }}
                onMouseOver={() => this.updateAddFilterColors('over')}
                onMouseLeave={() => this.updateAddFilterColors('leave')}
                onClick={() => this.handleOnClick()}
            >
                <AddButton
                    id="addTag-filter-add-button"
                    style={{
                        root: {
                            background: '',
                            marginLeft: 12,
                            marginRight: 4
                        },
                        icon: {
                            fill: addFilter.button
                        }
                    }}
                />

                <div
                    style={{
                        ...text,
                        ...light,
                        color: addFilter.text,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                    }}
                >
                    Add tag "{text}"
                </div>
            </div>
        )
    }
}

export default AddTag
