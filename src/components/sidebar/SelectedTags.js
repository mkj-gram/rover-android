import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { TextField, silver, graphite, ash, steel, Pill } from '@rover/react-bootstrap'
import AddTag from './AddTag'

class SelectedTags extends Component {
    constructor(props) {
        super(props)
        this.state = {
            text: '',
            highlightLast: false,
            highlightIndex: null
        }
        this.handleTextChange = this.handleTextChange.bind(this)
        this.handleKeyPress = this.handleKeyPress.bind(this)
        this.reset = this.reset.bind(this)
    }

    componentDidUpdate() {
        this.textFieldScroll.scrollIntoView({ behavior: 'smooth' })
    }

    componentDidMount() {
        this.textInput.focusTextInput()
    }

    handleTextChange(e) {
        this.setState({
            text: e.target.value
        })
    }

    handleKeyPress(event) {
        if (event.key == 'Enter' && this.state.text.length > 0) {
            this.props.updateTags(this.state.text, 'add', null)
            this.setState({
                text: ''
            })
        } else if (this.state.highlightLast && event.keyCode !== 8) {
            this.setState({
                highlightLast: false
            })
        } else if (
            event.keyCode === 8 &&
            this.props.tags.length > 0 &&
            this.state.text.length === 0
        ) {
            if (this.state.highlightLast) {
                this.props.updateTags(
                    null,
                    'delete',
                    this.props.tags.length - 1
                )
                this.setState({
                    highlightLast: false
                })
            } else {
                this.setState({
                    highlightLast: true,
                    highlightIndex: this.props.tags.length - 1
                })
            }
        }
    }

    reset() {
        this.setState({
            text: ''
        })
    }

    render() {
        return (
            <div
                style={{
                    marginTop: 20,
                    borderBottom: `1px solid ${steel}`,
                    width: 370
                }}
            >
                <div
                    style={{
                        display: 'flex'
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            alignContent: 'flex-start',
                            flexWrap: 'wrap',
                            width: 370,
                            minHeight: 36,
                            maxHeight: 107,
                            overflow: 'auto',
                            overflowX: 'hidden',
                            flex: '1 1'
                        }}
                    >
                        {this.props.tags.map((tag, index) => (
                            <Pill
                                index={index}
                                key={index}
                                text={tag}
                                maxWidth={370}
                                onHighlight={this.state.highlightLast}
                                highlightIndex={this.state.highlightIndex}
                                updateTags={this.props.updateTags}
                            />
                        ))}
                        <div
                            style={{ flex: '1 0 85px' }}
                            id="reactPillTextField"
                            ref={el => {
                                this.textFieldScroll = el
                            }}
                        >
                            <TextField
                                placeholder="Add Tag.."
                                value={this.state.text}
                                style={{
                                    color: 'white',
                                    borderColor: graphite,
                                    focus: {
                                        borderColor: graphite
                                    },
                                    marginTop: 6
                                }}
                                onChange={this.handleTextChange}
                                onKeyPress={this.handleKeyPress}
                                onKeyDown={this.handleKeyPress}
                                ref={(input) => { this.textInput = input }}
                            />
                        </div>
                    </div>
                    {this.state.text.length > 0 && (
                        <AddTag
                            text={this.state.text}
                            updateTags={this.props.updateTags}
                            reset={this.reset}
                            textInput={this.textInput}
                            tags={this.props.tags}
                            textScrollElem={this.textFieldScroll}
                        />
                    )}
                </div>
            </div>
        )
    }
}

export default SelectedTags
