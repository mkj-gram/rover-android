import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { createFragmentContainer, graphql } from 'react-relay'
import PropTypes from 'prop-types'
import moment from 'moment'

import {
    ash,
    graphite,
    IconButton,
    lavender,
    silver,
    TextField
} from '@rover/react-bootstrap'

import { SearchIcon } from '@rover/react-icons'

import FilterListItem from './FilterListItem'

class AddFilterModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            search: '',
            filterList: this.buildFilterList()
        }
        this.handleClickOutside = this.handleClickOutside.bind(this)
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
        const { deviceSchema, profileSchema } = schema

        const devices = deviceSchema.map(device => ({
            category: 'device',
            ...device
        }))
        const profiles = profileSchema.map(profile => ({
            category: 'profile',
            ...profile
        }))

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
            const { attribute } = filter
            if (
                attribute.toLowerCase().includes(search.toLowerCase()) ||
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

    render() {
        const style = {
            position: 'absolute',
            top: 17,
            left: 20,
            height: 350,
            width: 230,
            backgroundColor: graphite,
            borderRadius: 3,
            boxShadow: '0 3px 20px 0 rgba(0,0,0,0.25)',
            zIndex: 1
        }

        const { onRequestClose } = this.props
        return (
            <div style={style} onClick={() => this.handleClickOutside()}>
                <IconButton
                    type={'close'}
                    onClick={onRequestClose}
                    style={{
                        position: 'absolute',
                        top: 5,
                        right: 5,
                        zIndex: 1,
                        cursor: 'pointer'
                    }}
                    hoverStyle={{ color: lavender, backgroundColor: graphite }}
                />
                <SearchIcon
                    fill="white"
                    style={{
                        position: 'absolute',
                        top: 25,
                        left: 16
                    }}
                />
                <TextField
                    onChange={e => this.setState({ search: e.target.value })}
                    style={{
                        color: silver,
                        borderColor: ash,
                        focus: {
                            borderColor: ash
                        },
                        marginTop: 19,
                        padding: '3px 40px'
                    }}
                    placeholder="Search Filters"
                />
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

export default createFragmentContainer(
    AddFilterModal,
    graphql`
        fragment AddFilterModal_schema on SegmentSchema {
            deviceSchema {
                attribute
                __typename: type
            }
            profileSchema {
                attribute
                __typename: type
            }
        }
    `
)
