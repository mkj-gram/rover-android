import React from 'react'
import PropTypes from 'prop-types'

import {
    cloud,
    text,
    semibold,
    titanium,
    Modal,
    mercury,
    purple,
    light,
    Checkbox
} from '@rover/react-bootstrap'

import { getDeviceSchemaColumns } from '../../localSchemas/deviceSchema'
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
}) => {
    const customDevices = Object.keys(allColumns.devices).reduce((prev, next) => {
        if (allColumns.devices[next].selector === 'CUSTOM_DEVICE') {
            return {
                ...prev,
                [next]: {
                    ...allColumns.devices[next],
                    display: true,
                    filter: true
                }
            }
        }
        return prev
    }, {})

    const localDeviceSchema = getDeviceSchemaColumns()
    const deviceColumns = {
        devices: {
           ...localDeviceSchema.devices,
           ...customDevices
        },
        location: localDeviceSchema.location
    }
    return (
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
                    {allColumns.profiles.identifier &&
                        <div style={{ flex: '0 0 auto', paddingBottom: 17 }}>
                            <Checkbox
                                isChecked={showChecked('identifier', allColumns.profiles['identifier'])}
                                label='Profile Identifier'
                                primaryColor={purple}
                                isDisabled={false}
                                onChange={e =>
                                    updateChecked(
                                        "profiles",
                                        allColumns.profiles.identifier,
                                        'identifier',
                                        false
                                )}
                                style={{
                                    height: 16,
                                    width: 16,
                                    marginRight: 16
                                }}
                                labelStyle={{
                                    height: 16,
                                    ...text,
                                    ...light
                                }}
                            />
                        </div>
                    }
                    {Object.keys(deviceColumns).map(group => (
                        <div key={group}>
                        <ColumnDisplay
                            selector={group}
                            items={deviceColumns[group]}
                            updateChecked={updateChecked}
                            showChecked={showChecked}
                            devices
                        />
                        <div style={segmentLine} />
                        </div>
                        )
                    )}
                    <ColumnDisplay
                        selector="profiles"
                        items={allColumns.profiles}
                        updateChecked={updateChecked}
                        showChecked={showChecked}
                    />
                </div>
            </div>
        </Modal>
    )
}

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
