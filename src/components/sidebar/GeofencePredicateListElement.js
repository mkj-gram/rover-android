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
    radius: PropTypes.number,
    name: PropTypes.string,
    renderPredicateComparison: PropTypes.func.isRequired,
    renderPredicateValue: PropTypes.func.isRequired
}

GeofencePredicateListElement.defaultProps = {
    radius: 50,
    name: ''
}

export default GeofencePredicateListElement
