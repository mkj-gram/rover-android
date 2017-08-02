/* eslint-disable no-undef */
import React, { Component } from 'react'
import PropTypes from 'prop-types'

class GeofencePredicateListElement extends Component {
    constructor(props) {
        super(props)

        this.state = {
            placeName: ''
        }

        this.setState = this.setState.bind(this)
    }

    componentWillReceiveProps(nextProps) {
        const { latitude, longitude } = nextProps
        const location = new google.maps.LatLng(latitude, longitude)
        const geocoder = new google.maps.Geocoder()

        geocoder.geocode({ location }, (results, status) => {
            if (status === 'OK') {
                this.setState({ placeName: results[2].formatted_address })
            } else {
                this.setState({ placeName: `${latitude.toFixed(3)}, ${longitude.toFixed(3)}` })
            }
        })
    }

    render() {
        const { radius, renderPredicateComparison, renderPredicateValue } = this.props
        const { placeName } = this.state

        return (
            <div>
                {renderPredicateComparison('is within')}
                {renderPredicateValue(`${radius}m`)}
                {renderPredicateComparison('of')}
                {renderPredicateValue(placeName)}
            </div>
        )
    }
}

GeofencePredicateListElement.propTypes = {
    latitude: PropTypes.number,
    longitude: PropTypes.number,
    radius: PropTypes.number,
    renderPredicateComparison: PropTypes.func.isRequired,
    renderPredicateValue: PropTypes.func.isRequired
}

GeofencePredicateListElement.defaultProps = {
    latitude: 43.651,
    longitude: -79.375,
    radius: 100
}

export default GeofencePredicateListElement
