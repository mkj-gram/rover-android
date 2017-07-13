import React from 'react'
import moment from 'moment'

import { ash, lavender, silver, steel, text } from '@rover/react-bootstrap'

import { RemoveIcon } from '@rover/react-icons'

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

const renderPredicate = (value, comparison, type) => {
    switch (type) {
        case 'boolean':
            return renderBooleanPredicate(comparison, value)
            break
        case 'string':
            return renderStringPredicate(comparison, value)
            break
        case 'date':
            return renderDatePredicate(comparison, value)
            break
        case 'version':
            return renderVersionPredicate(comparison, value)
            break
        case 'number':
            return renderNumericPredicate(comparison, value)
            break
    }
}

const renderPredicateComparison = comparison =>
    <span style={predicateComparisonStyle}>{comparison}</span>

const renderPredicateValue = value =>
    <span style={predicateValueStyle}>{value}</span>

const renderBooleanPredicate = (comparison, value) =>
    <div>
        {renderPredicateValue(value ? 'ON' : 'OFF')}
    </div>
const renderStringPredicate = (comparison, value) =>
    <div>
        {renderPredicateComparison(comparison)}
        {renderPredicateValue(value)}
    </div>

const renderDatePredicate = (comparison, value) => {
    if (['exactly', 'less than', 'more than'].includes(comparison)) {
        return (
            <div>
                {renderPredicateComparison(comparison)}
                {renderPredicateValue(moment().diff(value.start, 'd'))}
                {renderPredicateComparison('days ago')}
            </div>
        )
    }

    if (['after', 'on', 'before'].includes(comparison)) {
        return (
            <div>
                {renderPredicateComparison(comparison)}
                {renderPredicateValue(
                    moment(value.start).format('MMM Do, YYYY')
                )}
            </div>
        )
    }

    if (comparison === 'in between') {
        return (
            <div>
                {renderPredicateComparison('between')}
                {renderPredicateValue(
                    moment(value.start).format('MMM Do, YYYY')
                )}
                {renderPredicateComparison('and')}
                {renderPredicateValue(moment(value.end).format('MMM Do, YYYY'))}
            </div>
        )
    }
}

const renderVersionPredicate = (comparison, value) => {
    if (comparison === 'is unknown') {
        return renderPredicateComparison(comparison)
    }

    if (comparison === 'in between') {
        const firstValue = value
            .slice(0, 3)
            .map((num, index) =>
                <span key={index}>{num}{index < 2 && '.'}</span>
            )

        const secondValue = value
            .slice(3)
            .map((num, index) =>
                <span key={index}>{num}{index < 2 && '.'}</span>
            )

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
            {renderPredicateComparison(comparison)}
            {renderPredicateValue(
                value
                    .slice(0, 3)
                    .map((num, index) =>
                        <span key={index}>{num}{index < 2 && '.'}</span>
                    )
            )}
        </div>
    )
}

const renderNumericPredicate = (comparison, value) => {
    if (comparison === 'has any value' || comparison === 'is unknown') {
        return renderPredicateComparison(comparison)
    }

    if (comparison === 'in between') {
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
            {renderPredicateValue(value)}
        </div>
    )
}

const PredicateList = ({ query, viewModal, removePredicate }) => {
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
        display: 'flex',
        flexWrap: 'wrap'
    }

    const onMouseOver = e => {
        e.target.style.backgroundColor = steel
        e.target.children[1].style.fill = silver
    }
    const onMouseLeave = e => {
        e.target.style.backgroundColor = ash
        e.target.children[1].style.fill = 'transparent'
    }

    return (
        <div style={listStyle} id="predicateList">
            {query.map(({ attribute, value, comparison, type }, index) => {
                return (
                    <div key={index}>
                        <div
                            style={predicateStyle}
                            onMouseOver={onMouseOver}
                            onMouseLeave={onMouseLeave}
                            onClick={() => viewModal(attribute, index)}
                        >
                            <div
                                style={{
                                    pointerEvents: 'none',
                                    display: 'flex',
                                    justifyContent: 'flex-start',
                                    flexWrap: 'wrap'
                                }}
                            >
                                <div style={{ flex: 'none', marginRight: 5 }}>
                                    {attribute}:
                                </div>
                                <div style={{ flex: '1 1 auto' }}>
                                    {renderPredicate(value, comparison, type)}
                                </div>
                            </div>
                            <RemoveIcon
                                style={{
                                    fill: 'transparent',
                                    position: 'absolute',
                                    top: 11,
                                    right: 9
                                }}
                                onClick={e => {
                                    e.stopPropagation()
                                    removePredicate(index)
                                }}
                                onMouseOver={e => e.stopPropagation()}
                                onMouseLeave={e => e.stopPropagation()}
                            />
                        </div>
                        {index < query.length - 1 &&
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
                                AND
                            </div>}
                    </div>
                )
            })}
        </div>
    )
}

export default PredicateList
