import React, { Component } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import {
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
    RadioButton
} from '@rover/react-bootstrap'

import { DeviceIconSmall, ProfileIcon } from '@rover/react-icons'

import BooleanInput from './BooleanInput'
import DateInput from './DateInput'
import NumericInput from './NumericInput'
import StringInput from './StringInput'
import VersionInput from './VersionInput'

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
                    comparison: 'true'
                },
                {
                    attribute: 'location-enabled',
                    value: false,
                    comparison: 'true'
                },
                {
                    attribute: 'push-enabled',
                    value: false,
                    comparison: 'true'
                },
                {
                    attribute: 'account-created',
                    value: {
                        start: moment('2017-06-12T15:17:30.756Z'),
                        end: null
                    },
                    comparison: 'exactly'
                },
                {
                    attribute: 'rover-sdk',
                    value: [12, 20, 1, 0, 1, 2],
                    comparison: 'in-between'
                },
                {
                    attribute: 'first-name',
                    value: 'Alex',
                    comparison: 'starts with'
                },
                {
                    attribute: 'age',
                    value: [5, 9],
                    comparison: 'is'
                }
            ]
        }
    }

    getAttributeType(attribute) {
        switch (attribute) {
            case 'account-created':
            case 'first-name':
            case 'age':
                return 'profile'
                break
            case 'bluetooth-enabled':
            case 'location-enabled':
            case 'push-enabled':
            case 'rover-sdk':
            default:
                return 'device'
                break
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

            return
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
        const title = attribute
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ')

        const attributeType = this.getAttributeType(attribute)

        const icon = attributeType === 'profile' ? ProfileIcon : DeviceIconSmall

        return (
            <div style={{
                display: 'flex',
                alignItems: 'center'
            }}>
                {icon({
                    style: {
                        fill: steel,
                        verticalAlign: 'middle',
                        marginRight: 10
                    }
                })}
                <span style={{ ...text, fontWeight: 600, color: 'white', marginRight: 5 }}>
                    {title}
                </span>
                <span style={{ ...text, ...light, color: silver }}>filter</span>
            </div>
        )
    }

    renderModalInput(attribute) {
        const updateFn = currentPredicate => this.setState({ currentPredicate })
        const predicate = this.getQueryPredicate(attribute)
        const attributeType = this.getAttributeType(attribute)

        const props = { predicate, updateFn, attributeType }

        switch (attribute) {
            case 'bluetooth-enabled':
            case 'location-enabled':
            case 'push-enabled':
                return <BooleanInput {...props} />
                break
            case 'account-created':
                return <DateInput {...props} />
                break
            case 'rover-sdk':
                return <VersionInput {...props} />
                break
            case 'first-name':
                return <StringInput {...props} />
                break
            case 'age':
                return <NumericInput {...props} />
                break
            default:
                return
        }
    }

    render() {
        const sideBarStyle = {
            height: '100%',
            width: 300,
            flex: '0 0 auto',
            backgroundColor: graphite
        }
        const { currentAttribute, currentPredicate, query } = this.state
        return (
            <div style={sideBarStyle}>
                <button
                    onClick={() =>
                        this.setState({
                            currentAttribute: 'bluetooth-enabled'
                        })}
                >
                    bluetooth
                </button>
                <button
                    onClick={() =>
                        this.setState({ currentAttribute: 'location-enabled' })}
                >
                    location
                </button>
                <button
                    onClick={() =>
                        this.setState({ currentAttribute: 'push-enabled' })}
                >
                    push
                </button>
                <button
                    onClick={() =>
                        this.setState({ currentAttribute: 'account-created' })}
                >
                    account-created
                </button>
                <button
                    onClick={() =>
                        this.setState({ currentAttribute: 'rover-sdk' })}
                >
                    Rover SDK
                </button>
                <button
                    onClick={() =>
                        this.setState({
                            currentAttribute: 'first-name'
                        })}
                >
                    First name
                </button>
                <button
                    onClick={() =>
                        this.setState({
                            currentAttribute: 'age'
                        })}
                >
                    Age
                </button>
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
                    {this.renderModalInput(currentAttribute)}
                </ModalWithHeader>
            </div>
        )
    }
}

export default SideBar
