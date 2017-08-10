import React from 'react'
import PropTypes from 'prop-types'

const GeofencePredicateListElement = ({
    radius,
    name,
    renderPredicateComparison,
    renderPredicateValue
}) =>
    (<div>
        {renderPredicateComparison('is within')}
        {renderPredicateValue(`${radius}m`)}
        {renderPredicateComparison('of')}
        {renderPredicateValue(name)}
    </div>)

GeofencePredicateListElement.propTypes = {
    radius: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    renderPredicateComparison: PropTypes.func.isRequired,
    renderPredicateValue: PropTypes.func.isRequired
}

export default GeofencePredicateListElement
