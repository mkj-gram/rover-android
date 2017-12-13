import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import moment from 'moment'

import {
    ash,
    graphite,
    IconButton,
    lavender,
    silver,
    TextField,
    text
} from '@rover/react-bootstrap'

import { SearchIcon } from '@rover/react-icons'

import FilterListItem from './FilterListItem'
import { getDeviceSchema } from '../../localSchemas/deviceSchema'
import roverProfileSchema from '../../localSchemas/roverProfileSchema'

class AddFilterModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            search: '',
            filterList: this.buildFilterList(),
            onFocus: false,
            clearColor: lavender
        }
        this.handleClickOutside = this.handleClickOutside.bind(this)
        this.handleTextFieldEvent = this.handleTextFieldEvent.bind(this)
        this.onHover = this.onHover.bind(this)
    }

    onHover(val) {
        this.setState({
            clearColor: val ? 'white' : lavender
        })
    }

    componentDidMount() {
        document.addEventListener('click', this.handleClickOutside, true)
    }

    componentWillUnmount() {
        document.removeEventListener('click', this.handleClickOutside, true)
    }

    handleClickOutside(e) {
        const domNode = ReactDOM.findDOMNode(this)
        if (e && (!domNode || !domNode.contains(e.target))) {
            this.props.onRequestClose()
        }
    }

    buildFilterList() {
        const { schema } = this.props
        const { profileSchema } = schema

        const devices = getDeviceSchema().map(device => ({
            selector: 'DEVICE',
            ...device
        })).filter((device) => device.filter !== false)

        const customProfiles = profileSchema.map(profile => ({
            selector: 'CUSTOM_PROFILE',
            ...profile
        }))

        const roverProfiles = roverProfileSchema().map(profile => ({
            selector: 'ROVER_PROFILE',
            ...profile
        }))

        const profiles = roverProfiles.concat(customProfiles)

        return devices.concat(profiles)
    }

    getFilterDefault(type) {
        switch (type) {
            case 'string':
                return { comparison: 'is', value: '' }
            case 'boolean':
                return { comparison: 'true', value: true }
            case 'number':
                return { comparison: 'is', value: [0] }
            case 'date':
                return {
                    comparison: 'exactly',
                    value: { start: moment(), end: {} }
                }
            case 'version':
                return {
                    comparison: 'equal to',
                    value: [0, 0, 0, 0, 0, 0]
                }
            default:
        }
    }

    renderFilterList() {
        const { search } = this.state
        const { onSelect } = this.props
        
        return this.state.filterList.map((filter, index) => {
            const { label } = filter
            if (
                label.toLowerCase().includes(search.toLowerCase()) ||
                search === ''
            ) {
                const filterWithDefaults = {
                    ...filter,
                    ...this.getFilterDefault(filter.type)
                }
                return (
                    <FilterListItem
                        filter={filterWithDefaults}
                        key={index}
                        onSelect={onSelect}
                    />
                )
            }
            return null
        })
    }

    handleTextFieldEvent(val) {
        this.setState({
            onFocus: val === 'focus'
        })
    }

    render() {
        const style = {
            position: 'absolute',
            top: 17,
            left: 20,
            height: 380,
            width: 230,
            backgroundColor: graphite,
            borderRadius: 3,
            boxShadow: '0 3px 20px 0 rgba(0,0,0,0.25)',
            zIndex: 1
        }

        const { onFocus, search, clearColor } = this.state
        const { onRequestClose } = this.props

        const placeholderStyle = 'color: rgba(255, 255, 255, 0.5);'

        return (
            <div style={style} onClick={() => this.handleClickOutside()}>
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        height: 35
                    }}
                >
                    <IconButton
                        type={'close'}
                        onClick={onRequestClose}
                        style={{
                            cursor: 'pointer',
                            margin: '10px 10px 3px 0px'
                        }}
                        hoverStyle={{
                            backgroundColor: ash
                        }}
                    />
                </div>

                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        height: 40,
                        backgroundColor: `${onFocus ? ash : ''}`
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center'
                        }}
                    >
                        <div
                            style={{
                                margin: '5px 9px 0px 18px'
                            }}
                        >
                            <SearchIcon fill={onFocus ? 'white' : silver} />
                        </div>
                        <TextField
                            onChange={e =>
                                this.setState({ search: e.target.value })}
                            style={{
                                color: 'white',
                                borderColor: graphite,
                                focus: {
                                    borderColor: ash
                                }
                            }}
                            placeholder="Search Filters"
                            onFocus={() => this.handleTextFieldEvent('focus')}
                            onBlur={() => this.handleTextFieldEvent('blur')}
                            value={this.state.search}
                            id="searchFiltertextField"
                            placeholderStyle={placeholderStyle}
                        />
                    </div>
                    {search.length > 0 &&
                        <div
                            style={{
                                ...text,
                                color: clearColor,
                                fontSize: 12,
                                marginRight: 20,
                                cursor: 'pointer'
                            }}
                            onClick={() => {
                                this.setState({
                                    search: '',
                                    clearColor: lavender
                                })
                                document
                                    .getElementById('searchFiltertextField')
                                    .focus()
                                this.handleTextFieldEvent('focus')
                            }}
                            onMouseOver={() => this.onHover(true)}
                            onMouseLeave={() => this.onHover(false)}
                        >
                            clear
                        </div>}
                </div>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        height: 303,
                        overflowX: 'scroll'
                    }}
                >
                    {this.renderFilterList()}
                </div>
            </div>
        )
    }
}

AddFilterModal.propTypes = {
    onSelect: PropTypes.func.isRequired,
    onRequestClose: PropTypes.func.isRequired,
    schema: PropTypes.object.isRequired
}

export default AddFilterModal