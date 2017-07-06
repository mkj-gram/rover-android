import React, { Component } from 'react'
import PropTypes from 'prop-types'

import ColumnDisplay from './ColumnDisplay'

import {
    purple,
    violet,
    cloud,
    text,
    semibold,
    titanium,
    ModalWithHeader,
    mercury
} from '@rover/react-bootstrap'

const modalContainer = {
    display: 'flex',
    flexDirection: 'column',
    flex: '0 0 auto',
    height: 300,
    width: 251,
    overflow: 'scroll'
}

const segmentLine = {
    width: 210,
    height: 1,
    backgroundColor: mercury,
    marginBottom: 21,
    flex: '0 0 auto'
}

class ColumnDisplayContainer extends Component {
    render() {
        const tempCategories = {
            Device: [
                'OS',
                'Hardware',
                'Bluetooth Enabled',
                'Location Enabled',
                'OS version',
                'Push Enabled',
                'Carrier',
                'Timezone',
                'SDK Version'
            ],
            Location: [
                'Location',
                'Latitude',
                'Longitude',
                'City',
                'Region',
                'Country',
                'Language',
                'Last Seen',
                'Created at',
                'Tags',
                'Custom Attribute'
            ],
            Profile: ['Gender', 'Age', 'Height', 'Race']
        }

        const {
            showColumnsMenu,
            updateChecked,
            showChecked,
            triggerColumnsMenu,
            pageClickLocation
        } = this.props

        return (
            <ModalWithHeader
                contentLabel="Column Builder"
                backgroundColor="white"
                isOpen={showColumnsMenu}
                headerContent="Display these columns"
                successFn={triggerColumnsMenu}
                successText="Update"
                cancelFn={triggerColumnsMenu}
                cancelText="Cancel"
                primaryColor={purple}
                secondaryColor={purple}
                modalHeaderStyle={{
                    backgroundColor: cloud,
                    ...text,
                    ...semibold
                }}
                modalFooterStyle={{
                    borderTop: `2px solid ${titanium}`,
                    padding: 0,
                    paddingTop: 20,
                    paddingLeft: 20,
                    height: 80
                }}
                modalChildrenStyle={{
                    margin: 0,
                    marginTop: 20,
                    marginLeft: 20
                }}
                hoverColor={violet}
                modalContentStyle={{
                    bottom: null,
                    padding: 0,
                    right: null,
                    top: pageClickLocation.y,
                    left: pageClickLocation.x,
                    transform: null
                }}
                modalOverlayStyle={{
                    position: null,
                    backgroundColor: null
                }}
                bodyOpenClassName="bodyClassName"
                hoverStyle={{backgroundColor: titanium}}
            >
                <div style={modalContainer}>
                    <ColumnDisplay
                        category="Device"
                        items={tempCategories['Device']}
                        updateChecked={updateChecked}
                        showChecked={showChecked}
                    />
                    <div style={segmentLine} />
                    <ColumnDisplay
                        category="Location"
                        items={tempCategories['Location']}
                        updateChecked={updateChecked}
                        showChecked={showChecked}
                    />
                    <div style={segmentLine} />
                    <ColumnDisplay
                        category="Profile"
                        items={tempCategories['Profile']}
                        updateChecked={updateChecked}
                        showChecked={showChecked}
                    />
                </div>
            </ModalWithHeader>
        )
    }
}

ColumnDisplayContainer.propTypes = {
    showColumnsMenu: PropTypes.bool.isRequired,
    updateChecked: PropTypes.func.isRequired,
    showChecked: PropTypes.func.isRequired,
    triggerColumnsMenu: PropTypes.func.isRequired,
    pageClickLocation: PropTypes.object.isRequired
}

ColumnDisplayContainer.defaultProps = {
    showColumnsMenu: false,
    updateChecked: () => null,
    showChecked: () => null,
    triggerColumnsMenu: () => null,
    pageClickLocation: {
        x: 0,
        y: 0
    }
}

export default ColumnDisplayContainer
