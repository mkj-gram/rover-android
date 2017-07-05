import React, { Component } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import {
    AddButton,
    ash,
    ModalWithHeader,
    graphite,
    onyx,
    RoundedButton,
    text,
    light,
    bold,
    steel,
    silver,
    violet,
    lavender,
    orchid,
    Select,
    slate,
    RadioButton
} from '@rover/react-bootstrap'

import { DeviceIconSmall, ProfileIcon } from '@rover/react-icons'

import BooleanInput from './BooleanInput'
import DateInput from './DateInput'
import NumericInput from './NumericInput'
import StringInput from './StringInput'
import VersionInput from './VersionInput'
import FunnelAnimation from './FunnelAnimation'

import PredicateList from './PredicateList'

class SideBar extends Component {
    constructor(props) {
        super(props)

        this.state = {
            currentAttribute: '',
            currentPredicate: {},
            query: [
                {
                    attribute: 'bluetooth-enabled',
                    value: false,
                    comparison: 'true',
                    type: 'boolean',
                    category: 'device'
                },
                {
                    attribute: 'location-enabled',
                    value: true,
                    comparison: 'true',
                    type: 'boolean',
                    category: 'device'
                },
                {
                    attribute: 'push-enabled',
                    value: false,
                    comparison: 'true',
                    type: 'boolean',
                    category: 'device'
                },
                {
                    attribute: 'account-created',
                    value: {
                        start: moment('2017-06-12T15:17:30.756Z'),
                        end: null
                    },
                    comparison: 'exactly',
                    type: 'date',
                    category: 'profile'
                },
                {
                    attribute: 'rover-sdk',
                    value: [12, 20, 1, 0, 1, 2],
                    comparison: 'in between',
                    type: 'version',
                    category: 'device'
                },
                {
                    attribute: 'first-name',
                    value: 'Alex',
                    comparison: 'starts with',
                    type: 'string',
                    category: 'profile'
                },
                {
                    attribute: 'age',
                    value: [5],
                    comparison: 'is',
                    type: 'number',
                    category: 'profile'
                },
                {
                    attribute: 'rover-sdk',
                    value: [12, 20, 1, 0, 1, 2],
                    comparison: 'in between',
                    type: 'version',
                    category: 'device'
                },
                {
                    attribute: 'first-name',
                    value: 'Alex',
                    comparison: 'starts with',
                    type: 'string',
                    category: 'profile'
                },
                {
                    attribute: 'age',
                    value: [5],
                    comparison: 'is',
                    type: 'number',
                    category: 'profile'
                }
            ]
        }
    }

    getQueryPredicate(attribute) {
        const { query } = this.state

        return query.filter(obj => obj.attribute === attribute)[0]
    }

    updateQuery() {
        const { query, currentPredicate } = this.state

        const queryCopy = query

        if (
            queryCopy.filter(
                ({ attribute }) => attribute !== currentPredicate.attribute
            ).length === 0
        ) {
            this.setState({ query: queryCopy.concat(currentPredicate) })

            return4
        }

        const newQuery = queryCopy.reduce((prev, curr) => {
            if (curr.attribute === currentPredicate.attribute) {
                return prev.concat(currentPredicate)
            }

            return prev.concat(curr)
        }, [])

        this.setState({ query: newQuery, currentAttribute: '' })
    }

    renderModalTitle(attribute) {
        const { query } = this.state
        const title = attribute
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ')

        const category = query.filter(obj => obj.attribute === attribute)[0]

        const icon = category === 'profile' ? ProfileIcon : DeviceIconSmall

        return (
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center'
                }}
            >
                {icon({
                    style: {
                        fill: steel,
                        verticalAlign: 'middle',
                        marginRight: 10
                    }
                })}
                <span
                    style={{
                        ...text,
                        fontWeight: 600,
                        color: 'white',
                        marginRight: 5
                    }}
                >
                    {title}
                </span>
                <span style={{ ...text, ...light, color: silver }}>filter</span>
            </div>
        )
    }

    renderModalInput(attribute) {
        const updateFn = currentPredicate => this.setState({ currentPredicate })
        const predicate = this.getQueryPredicate(attribute)
        const { type } = predicate
        const props = { predicate, updateFn }

        switch (type) {
            case 'boolean':
                return <BooleanInput {...props} />
                break
            case 'date':
                return <DateInput {...props} />
                break
            case 'version':
                return <VersionInput {...props} />
                break
            case 'string':
                return <StringInput {...props} />
                break
            case 'number':
                return <NumericInput {...props} />
                break
            default:
                return
        }
    }

    renderAddFilterBar() {
        const style = {
            height: 58,
            width: '100%',
            backgroundColor: slate,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            flex: 'none'
        }

        const selectStyle = {
            backgroundColor: slate,
            border: 'none',
            borderRadius: 3,
            width: 95,
            height: 30
        }

        const onFocus = e => (e.target.style.backgroundColor = graphite)
        const onBlur = e => (e.target.style.backgroundColor = slate)

        return (
            <div style={style}>
                <AddButton
                    primaryColor={orchid}
                    onClick={e => console.log('add button clicked')}
                    style={{ root: { marginLeft: 20 } }}
                />
                <div
                    style={{
                        ...text,
                        fontSize: 15,
                        color: lavender,
                        fontWeight: 'normal'
                    }}
                >
                    Add Filter
                </div>
                <div style={{ marginLeft: 'auto', marginRight: 30 }}>
                    <Select
                        style={selectStyle}
                        isDisabled={false}
                        value={'all'}
                        onChange={e => console.log(e.target.value)}
                        onFocus={onFocus}
                        onBlur={onBlur}
                    >
                        <option value="all" label="Match all">all</option>
                        <option value="any" label="Match any">any</option>
                    </Select>
                </div>
            </div>
        )
    }

    renderSaveBar() {
        const style = {
            height: 75,
            width: 300,
            backgroundColor: slate,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flex: 'none'
        }

        return (
            <div style={style}>
                <RoundedButton
                    type="primary"
                    primaryColor={violet}
                    hoverColor={orchid}
                    style={{
                        width: 88,
                        marginRight: 5
                    }}
                >
                    Save
                </RoundedButton>
                <RoundedButton
                    type="primary"
                    primaryColor={graphite}
                    hoverColor={ash}
                    style={{
                        width: 160,
                        marginLeft: 5,
                        display: 'flex',
                        alignItems: 'center'
                    }}
                >
                    <div
                        style={{
                            backgroundColor: violet,
                            color: 'white',
                            height: 22,
                            width: 22,
                            borderRadius: 11,
                            fontSize: 11,
                            marginRight: 5,
                            lineHeight: '22px',
                            pointerEvents: 'none'
                        }}
                    >
                        16
                    </div>
                    My Segments
                </RoundedButton>
            </div>
        )
    }

    render() {
        const sideBarStyle = {
            height: '100%',
            width: 300,
            flex: '0 0 auto',
            backgroundColor: graphite,
            display: 'flex',
            flexDirection: 'column'
        }
        const { currentAttribute, currentPredicate, query } = this.state
        return (
            <div style={sideBarStyle}>
                <ModalWithHeader
                    contentLabel="Query Builder"
                    backgroundColor={graphite}
                    isOpen={currentAttribute !== ''}
                    headerContent={this.renderModalTitle(currentAttribute)}
                    successFn={() => this.updateQuery()}
                    successText="Add filter"
                    cancelFn={() => this.setState({ currentAttribute: '' })}
                    cancelText="Cancel"
                    primaryColor={violet}
                    secondaryColor={lavender}
                    hoverColor={orchid}
                >
                    {currentAttribute !== '' ?
                        this.renderModalInput(currentAttribute) : <div/>}
                </ModalWithHeader>
                {this.renderAddFilterBar()}
                {
                    query.length > 0 ?
                        <PredicateList
                            query={query}
                            viewModal={attribute =>
                                this.setState({ currentAttribute: attribute })}
                        />
                        :
                        <div
                            style={{
                                ...text,
                                color: silver,
                                margin: '30px auto',
                                width: 210,
                                height: '100%',
                                textAlign: 'center'
                            }}
                        >
                            <FunnelAnimation/>
                            <div style={{ marginBottom: 30 }}>
                                <span style={{ color: lavender, marginRight: 5, cursor: 'pointer' }}>
                                    Add a filter
                                </span>
                                to start building segments based on your audience data
                            </div>
                            <div>
                                When you're done with it, just <span style={{ color: 'white' }}>Save</span> it for later use
                            </div>
                        </div>
                }
                {query.length > 0 && this.renderSaveBar()}
            </div>
        )
    }
}

export default SideBar
