/* eslint-disable no-undef */
/* eslint-disable no-underscore-dangle */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withGoogleMap, GoogleMap, Circle } from 'react-google-maps'

import SearchBox from 'react-google-maps/lib/places/SearchBox'

import Slider from 'react-rangeslider'

import { purple, silver, slate, text, violet } from '@rover/react-bootstrap'

import ModalInput from './ModalInput'
import ModalInputPrompt from './ModalInputPrompt'

const placeInputStyle = {
    ...text,
    boxSizing: `border-box`,
    MozBoxSizing: `border-box`,
    border: `1px solid transparent`,
    width: 240,
    height: 32,
    marginTop: 5,
    marginLeft: 5,
    padding: `0 12px`,
    borderRadius: `1px`,
    boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
    fontSize: `14px`,
    outline: `none`,
    textOverflow: `ellipses`,
    cursor: 'text'
}

const RenderMap = withGoogleMap((props) => {
    const {
        center,
        bounds,
        onMapMounted,
        onBoundsChanged,
        onCircleDragged,
        onPlacesChanged,
        onSearchBoxMounted,
        radius,
        zoom
    } = props

    return (
        <GoogleMap
            ref={onMapMounted}
            center={center}
            defaultZoom={16}
            defaultCenter={{ lng: -79.375, lat: 43.65 }}
            onBoundsChanged={onBoundsChanged}
            options={{
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                disableDefaultUI: true
            }}
            zoom={zoom}
        >
            <SearchBox
                inputStyle={placeInputStyle}
                ref={onSearchBoxMounted}
                bounds={bounds}
                controlPosition={google.maps.ControlPosition.TOP_LEFT}
                onPlacesChanged={onPlacesChanged}
                inputPlaceholder="Enter a place"
            />
            <Circle
                center={center}
                radius={radius}
                options={{
                    fillColor: purple,
                    fillOpacity: 0.3,
                    strokeColor: purple,
                    strokeOpacity: 1,
                    strokeWeight: 2
                }}
                draggable
                onDragEnd={e => onCircleDragged(e)}
            />
        </GoogleMap>
    )
})

class GeofenceInput extends Component {
    constructor(props) {
        super(props)
        const { geofenceComparison, geofenceValue } = this.props
        const { latitude, longitude, radius } = geofenceValue

        this.state = {
            bounds: null,
            center: new google.maps.LatLng(latitude, longitude),
            radius,
            zoom: Math.round(23 - Math.log(radius) / Math.LN2),
            geofenceComparison
        }

        this.handleMapMounted = this.handleMapMounted.bind(this)
        this.handleBoundsChanged = this.handleBoundsChanged.bind(this)
        this.handleCircleDragged = this.handleCircleDragged.bind(this)
        this.handleSearchBoxMounted = this.handleSearchBoxMounted.bind(this)
        this.handlePlacesChanged = this.handlePlacesChanged.bind(this)
        this.handleRadiusChange = this.handleRadiusChange.bind(this)
    }

    componentDidMount() {
        this.updateValue()
    }

    handleMapMounted(map) {
        this._map = map
    }

    handleBoundsChanged() {
        this.setState({
            bounds: this._map.getBounds(),
            center: this._map.getCenter()
        })
    }

    handleCircleDragged({ latLng }) {
        this.setState({ center: latLng }, this.updateValue)
    }

    handleSearchBoxMounted(searchBox) {
        this._searchBox = searchBox
    }

    handlePlacesChanged() {
        const places = this._searchBox.getPlaces()

        const mapCenter = places.map(({ geometry }) => geometry.location)

        this.setState({ center: mapCenter[0] }, this.updateValue)
    }

    handleRadiusChange(radius) {
        const requiredZoom = Math.round(23 - Math.log(radius) / Math.LN2)
        let zoom = this._map.getZoom()
        if (zoom !== requiredZoom) {
            zoom = requiredZoom
        }
        this.setState({ radius, zoom }, this.updateValue)
    }

    updateValue() {
        const { attribute, category, __typename, index, updateFn } = this.props
        const { geofenceComparison, center, radius } = this.state
        const { lat, lng } = center

        updateFn({
            attribute,
            geofenceComparison,
            category,
            index,
            geofenceValue: {
                latitude: lat(),
                longitude: lng(),
                radius
            },
            __typename
        })
    }

    render() {
        const { attribute, category } = this.props
        const { bounds, center, radius, zoom } = this.state
        return (
            <div style={{ ...text, color: silver }}>
                <ModalInputPrompt
                    attribute={attribute}
                    attributeType={category}
                    style={{ display: 'inline' }}
                />
                <div style={{ display: 'inline' }}> within</div>
                <RenderMap
                    containerElement={
                        <div
                            style={{ height: 211, width: 436, marginTop: 20 }}
                        />
                    }
                    mapElement={<div style={{ height: '100%' }} />}
                    center={center}
                    radius={radius}
                    onMapMounted={this.handleMapMounted}
                    onBoundsChanged={this.handleBoundsChanged}
                    onCircleDragged={this.handleCircleDragged}
                    onSearchBoxMounted={this.handleSearchBoxMounted}
                    bounds={bounds}
                    onPlacesChanged={this.handlePlacesChanged}
                    zoom={zoom}
                />
                <div
                    style={{
                        margin: '20px 0',
                        ...text,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'left',
                        color: silver,
                        fontSize: 13
                    }}
                >
                    <div>Radius:</div>
                    <ModalInput
                        type="number"
                        style={{
                            width: 60
                        }}
                        min={50}
                        max={99999}
                        value={radius}
                        onChange={e =>
                            this.handleRadiusChange(
                                parseInt(e.target.value, 10)
                            )}
                    />
                    <div>metres</div>
                </div>
                <div
                    className="roverRangeSlider"
                    style={{ marginTop: 20, width: 436 }}
                >
                    <style type="text/css">
                        {`
                            .roverRangeSlider .rangeslider.rangeslider-horizontal {
                                display: block;
                                height: 21px;
                                width: 100%;
                            }
                            .roverRangeSlider .rangeslider__fill {
                                display: block;
                                height: 3px;
                                width: 100%!important;
                                background: ${slate};
                                position: relative;
                                top: 10px;
                            }
                            .roverRangeSlider .rangeslider__handle {
                                display: inline-block;
                                cursor: pointer;
                                position: absolute;
                                height: 16px;
                                width: 16px;
                                border-radius: 8px;
                                background: ${violet};
                                box-shadow: 0 2px 0 0 rgba(0,0,0,0.14);
                                margin-left: 20px;
                            }
                            .roverRangeSlider .rangeslider__tooltip {
                                display: none;
                            }
                        `}
                    </style>
                    <Slider
                        min={50}
                        max={500}
                        value={radius}
                        orientation="horizontal"
                        onChange={this.handleRadiusChange}
                    />
                </div>
            </div>
        )
    }
}

GeofenceInput.propTypes = {
    attribute: PropTypes.string.isRequired,
    geofenceValue: PropTypes.object,
    geofenceComparison: PropTypes.string,
    category: PropTypes.string.isRequired,
    index: PropTypes.number.isRequired,
    updateFn: PropTypes.func.isRequired,
    __typename: PropTypes.string.isRequired
}

GeofenceInput.defaultProps = {
    geofenceValue: {
        latitude: 43.650678,
        longitude: -79.375814,
        radius: 100
    },
    geofenceComparison: 'IS_WITHIN'
}

export default GeofenceInput
