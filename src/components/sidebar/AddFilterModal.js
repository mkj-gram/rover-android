import React, { Component } from 'react'
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
            filterList: [
                {
                    attribute: 'bluetooth-enabled',
                    type: 'boolean',
                    category: 'device'
                },
                {
                    attribute: 'location-enabled',
                    type: 'boolean',
                    category: 'device'
                },
                {
                    attribute: 'push-enabled',
                    type: 'boolean',
                    category: 'device'
                },
                {
                    attribute: 'rover-sdk',
                    type: 'version',
                    category: 'device'
                },
                {
                    attribute: 'first-name',
                    type: 'string',
                    category: 'profile'
                },
                {
                    attribute: 'age',
                    type: 'number',
                    category: 'profile'
                },
                {
                    attribute: 'rover-sdk',
                    type: 'version',
                    category: 'device'
                },
                {
                    attribute: 'first-name',
                    type: 'string',
                    category: 'profile'
                },
                {
                    attribute: 'age',
                    type: 'number',
                    category: 'profile'
                },
                {
                    attribute: 'account-created',
                    type: 'date',
                    category: 'profile'
                }
            ]
        }
    }

    getFilterDefault(type) {
        switch (type) {
            case 'string':
                return { comparison: 'is', value: '' }
                break
            case 'boolean':
                return { comparison: 'true', value: true }
                break
            case 'number':
                return { comparison: 'is', value: [0] }
                break
            case 'date':
                return {
                    comparison: 'exactly',
                    value: { start: moment(), end: {} }
                }
                break
            case 'version':
                return {
                    comparison: 'equal to',
                    value: [0, 0, 0, 0, 0, 0]
                }
                break
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
        })
    }

    render() {
        const style = {
            position: 'absolute',
            top: 75,
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
            <div style={style}>
                <IconButton
                    type={'close'}
                    onClick={onRequestClose}
                    style={{
                        position: 'absolute',
                        top: 5,
                        right: 5,
                        zIndex: 1
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

export default AddFilterModal
