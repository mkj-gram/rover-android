/* eslint react/prop-types: "off" */
import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'

import { ash, lavender, silver, steel, text } from '@rover/react-bootstrap'

import { RemoveIcon } from '@rover/react-icons'

import GeofencePredicateListElement from './GeofencePredicateListElement'

const listStyle = {
    padding: 20,
    fontFamily: 'Source Sans Pro',
    overflowY: 'scroll',
    flex: '1 1 auto'
}

const predicateComparisonStyle = {
    ...text,
    fontSize: 12,
    color: silver,
    fontStyle: 'italic',
    marginRight: 5,
    fontWeight: 500
}

const predicateValueStyle = {
    ...text,
    marginRight: 5,
    color: lavender
}

const renderPredicate = ({ __typename, ...rest }) => {
    switch (__typename) {
        case 'BooleanPredicate':
            return renderBooleanPredicate(rest)
        case 'StringPredicate':
            return renderStringPredicate(rest)
        case 'DatePredicate':
            return renderDatePredicate(rest)
        case 'VersionPredicate':
            return renderVersionPredicate(rest)
        case 'NumberPredicate':
            return renderNumericPredicate(rest)
        case 'GeofencePredicate':
            return renderGeofencePredicate(rest)
        case 'FloatPredicate':
            return renderNumericPredicate(rest)
        case 'StringArrayPredicate':
            return renderStringArrayPredicate(rest)
        default:
    }
}

const renderStringArrayPredicate = ({
    stringArrayValue,
    stringArrayComparison
}) => {
    if (
        [
            'contains any',
            'does not contain any',
            'contains all',
            'does not contain all'
        ].includes(stringArrayComparison)
    ) {
        return (
            <div
                style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    ...text,
                    fontSize: 12
                }}
            >
                {stringArrayValue.map((value, index) => (
                    <span
                        style={{
                            ...text,
                            fontSize: 14,
                            color: lavender,
                            marginTop: 9
                        }}
                        key={index}
                    >
                        {' '}
                        {value}
                        <span
                            style={{
                                ...text,
                                fontSize: 10,
                                color: silver,
                                marginRight: 8,
                                marginLeft: 8,
                                marginBottm: 2
                            }}
                        >
                            {stringArrayValue.length !==
                            index + 1 ? stringArrayComparison.includes(
                                'all'
                            ) ? (
                                'AND'
                            ) : (
                                'OR'
                            ) : (
                                ''
                            )}
                        </span>
                    </span>
                ))}
            </div>
        )
    }
}

const renderPredicateComparison = comparison => (
    <span style={predicateComparisonStyle}>{comparison}</span>
)

const renderPredicateValue = value => (
    <span style={predicateValueStyle}>{value}</span>
)

const renderBooleanPredicate = ({ booleanValue }) => (
    <div>{renderPredicateValue(booleanValue ? 'ON' : 'OFF')}</div>
)
const renderStringPredicate = ({ stringComparison, stringValue }) => (
    <div>
        {renderPredicateComparison(stringComparison)}
        {renderPredicateValue(stringValue)}
    </div>
)

const renderDatePredicate = ({ dateComparison, dateValue }) => {
    if (['is equal', 'is less than', 'is greater than'].includes(dateComparison)) {
        return (
            <div>
                {renderPredicateComparison(dateComparison)}
                {renderPredicateValue(moment().diff(dateValue.start, 'd'))}
                {renderPredicateComparison('days ago')}
            </div>
        )
    }

    if (['is after', 'is on', 'is before'].includes(dateComparison)) {
        return (
            <div>
                {renderPredicateComparison(dateComparison)}
                {renderPredicateValue(
                    moment(dateValue.start).format('MMM Do, YYYY')
                )}
            </div>
        )
    }

    if (dateComparison === 'is between') {
        return (
            <div>
                {renderPredicateComparison('between')}
                {renderPredicateValue(
                    moment(dateValue.start).format('MMM Do, YYYY')
                )}
                {renderPredicateComparison('and')}
                {renderPredicateValue(
                    moment(dateValue.end).format('MMM Do, YYYY')
                )}
            </div>
        )
    }
}

const renderVersionPredicate = ({
    versionComparison,
    versionValue = [0, 0, 0]
}) => {
    if (versionComparison === 'is unknown') {
        return renderPredicateComparison(versionComparison)
    }

    if (versionComparison === 'is between') {
        const firstValue = versionValue.slice(0, 3).map((num, index) => (
            <span key={index}>
                {num}
                {index < 2 && '.'}
            </span>
        ))

        const secondValue = versionValue.slice(3).map((num, index) => (
            <span key={index}>
                {num}
                {index < 2 && '.'}
            </span>
        ))

        return (
            <div>
                {renderPredicateComparison('between')}
                {renderPredicateValue(firstValue)}
                {renderPredicateComparison('and')}
                {renderPredicateValue(secondValue)}
            </div>
        )
    }

    return (
        <div>
            {renderPredicateComparison(versionComparison)}
            {renderPredicateValue(
                versionValue.slice(0, 3).map((num, index) => (
                    <span key={index}>
                        {num}
                        {index < 2 && '.'}
                    </span>
                ))
            )}
        </div>
    )
}

const renderNumericPredicate = ({
    numberComparison,
    numberValue,
    floatComparison,
    floatValue
}) => {
    let comparison, 
value
    if (numberComparison === undefined && numberValue === undefined) {
        comparison = floatComparison
        value = floatValue
    } else if (floatComparison === undefined && floatValue === undefined) {
        comparison = numberComparison
        value = numberValue
    }

    if (comparison === 'has any value' || comparison === 'is unknown') {
        return renderPredicateComparison(comparison)
    }

    if (comparison === 'is between') {
        return (
            <div>
                {renderPredicateComparison('between')}
                {renderPredicateValue(value[0])}
                {renderPredicateComparison('and')}
                {renderPredicateValue(value[1])}
            </div>
        )
    }
    return (
        <div>
            {renderPredicateComparison(comparison)}
            {renderPredicateValue(value && value[0])}
        </div>
    )
}

const getFlexDirection = ({ __typename }) => __typename === 'StringArrayPredicate' ? 'column' : 'row'

const renderGeofencePredicate = ({ geofenceValue }) => (
    <GeofencePredicateListElement
        {...geofenceValue}
        renderPredicateComparison={renderPredicateComparison}
        renderPredicateValue={renderPredicateValue}
    />
)

const renderLabel = (label, rest) => {
    let textToRender

    if (
        rest.__typename === 'StringArrayPredicate' &&
        rest.hasOwnProperty('stringArrayComparison')
    ) {
        textToRender = rest.stringArrayComparison.includes('does not')
            ? 'Is Not Tagged'
            : 'Is Tagged'
    } else {
        textToRender = label
    }

    return textToRender
}

const PredicateList = ({
    clearQuery,
    query,
    queryCondition,
    viewModal,
    removePredicate
}) => {
    const predicateStyle = {
        width: 260,
        backgroundColor: ash,
        borderRadius: 3,
        padding: '13px 16px',
        color: 'white',
        fontSize: 14,
        position: 'relative'
    }

    const separatorStyle = {
        height: 32,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 12,
        color: steel,
        position: 'relative',
        flexWrap: 'wrap'
    }

    const clearAllStyle = {
        position: 'absolute',
        right: 40,
        marginTop: 10,
        ...text,
        fontSize: 12,
        color: lavender,
        cursor: 'default'
    }

    const onHoverClearAll = (e) => {
        e.target.style.color = 'white'
    }

    const onLeaveClearAll = (e) => {
        e.target.style.color = lavender
    }

    const onMouseOver = (e) => {
        e.target.style.backgroundColor = steel
        e.target.children[1].style.fill = silver
    }
    const onMouseLeave = (e) => {
        e.target.style.backgroundColor = ash
        e.target.children[1].style.fill = 'transparent'
    }

    return (
        <div style={listStyle} id="predicateList">
            {query.map(({ attribute, label, ...rest }, index) => (
                <div key={index}>
                    <div
                        style={predicateStyle}
                        onMouseOver={onMouseOver}
                        onMouseLeave={onMouseLeave}
                        onClick={() => viewModal(attribute, index, label)}
                    >
                        <div
                            style={{
                                pointerEvents: 'none',
                                display: 'flex',
                                justifyContent: 'flex-start',
                                flexWrap: 'wrap',
                                flexDirection: getFlexDirection(rest)
                            }}
                        >
                            <div style={{ flex: 'none', marginRight: 5 }}>
                                {renderLabel(label, rest)}:
                            </div>
                            <div style={{ flex: '1 1 auto' }}>
                                {renderPredicate(rest)}
                            </div>
                        </div>
                        <RemoveIcon
                            style={{
                                fill: 'transparent',
                                position: 'absolute',
                                top: 11,
                                right: 9
                            }}
                            onClick={(e) => {
                                e.stopPropagation()
                                removePredicate(index)
                            }}
                            onMouseOver={e => e.stopPropagation()}
                            onMouseLeave={e => e.stopPropagation()}
                        />
                    </div>
                    {index < query.length - 1 && (
                        <div style={separatorStyle}>
                            <div
                                style={{
                                    flex: 'none',
                                    height: 32,
                                    width: 3,
                                    left: 17,
                                    backgroundColor: ash,
                                    position: 'absolute'
                                }}
                            />
                            {queryCondition === 'ALL' ? 'AND' : 'OR'}
                        </div>
                    )}
                    {query.length > 1 && index === query.length - 1 && (
                        <div
                            style={clearAllStyle}
                            onClick={clearQuery}
                            onMouseOver={onHoverClearAll}
                            onMouseOut={onLeaveClearAll}
                        >
                            Clear All
                        </div>
                    )}
                </div>
            ))}
            <div style={{ height: `${(window.innerHeight - 193) / 2}px` }} />
        </div>
    )
}

PredicateList.propTypes = {
    clearQuery: PropTypes.func.isRequired,
    query: PropTypes.array.isRequired,
    queryCondition: PropTypes.string.isRequired,
    viewModal: PropTypes.func.isRequired,
    removePredicate: PropTypes.func.isRequired
}

export default PredicateList
