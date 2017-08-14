import React from 'react'
import PropTypes from 'prop-types'

import {
    purple,
    violet,
    cloud,
    text,
    semibold,
    titanium,
    Modal,
    mercury,
    graphite
} from '@rover/react-bootstrap'

import ColumnDisplay from './ColumnDisplay'

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

const ColumnDisplayContainer = ({
    updateChecked,
    showChecked,
    triggerColumnsMenu,
    pageClickLocation,
    showColumnsMenu,
    allColumns
}) => (
    <Modal
        isOpen={showColumnsMenu}
        onRequestClose={triggerColumnsMenu}
        contentLabel="Column Builder"
        style={{
            content: {
                backgroundColor: 'white',
                padding: 0,
                width: 'auto',
                bottom: null,
                padding: 0,
                right: null,
                top: pageClickLocation.y,
                left: pageClickLocation.x,
                transform: null
            }
        }}
        hoverStyle={{
            backgroundColor: titanium
        }}
        bodyOpenClassName="bodyClassName"
    >
        <div
            style={{
                position: 'relative',
                width: '100%',
                height: 50,
                display: 'flex',
                alignItems: 'center',
                paddingLeft: 20,
                backgroundColor: cloud,
                ...text,
                ...semibold
            }}
        >
            Display these columns
        </div>
        <div
            style={{
                margin: 0,
                marginTop: 20,
                marginLeft: 20
            }}
        >
            <div style={modalContainer}>
                <ColumnDisplay
                    category="devices"
                    items={Object.keys(allColumns.devices)}
                    updateChecked={updateChecked}
                    showChecked={showChecked}
                />
                <div style={segmentLine} />
                <ColumnDisplay
                    category="profiles"
                    items={Object.keys(allColumns.profiles)}
                    updateChecked={updateChecked}
                    showChecked={showChecked}
                />
            </div>
        </div>
    </Modal>
)

ColumnDisplayContainer.propTypes = {
    showColumnsMenu: PropTypes.bool.isRequired,
    updateChecked: PropTypes.func.isRequired,
    showChecked: PropTypes.func.isRequired,
    triggerColumnsMenu: PropTypes.func.isRequired,
    pageClickLocation: PropTypes.object.isRequired,
    allColumns: PropTypes.object.isRequired
}

ColumnDisplayContainer.defaultProps = {
    showColumnsMenu: false,
    updateChecked: () => null,
    showChecked: () => null,
    triggerColumnsMenu: () => null,
    pageClickLocation: {
        x: 0,
        y: 0
    },
    allColumns: {}
}

export default ColumnDisplayContainer
