import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
    purple,
    RoundedButton,
    text,
    silver,
    light,
    violet,
    Checkbox
} from '@rover/react-bootstrap'

import { DeviceIconSmall, ProfileIcon, LocationIcon } from '@rover/react-icons'

class ColumnDisplay extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showAll: false
        }
        this.triggerShowHide = this.triggerShowHide.bind(this)
        this.showMore = this.showMore.bind(this)
        this.getSelector = this.getSelector.bind(this)
    }

    triggerShowHide() {
        this.setState({ ...this.state, showAll: !this.state.showAll })
    }

    showMore(remaining) {
        if (!this.state.showAll && remaining > 0) {
            return (
                <div style={{ marginBottom: 21 }}>
                    <RoundedButton
                        type="cancel"
                        primaryColor={purple}
                        hoverColor={violet}
                        onClick={this.triggerShowHide}
                        style={{
                            cursor: 'pointer',
                            padding: 0,
                            lineHeight: 0,
                            display: false
                        }}
                    >
                        + {remaining} more
                    </RoundedButton>
                </div>
            )
        }
    }

    getSelector(selector) {
        switch (selector) {
            case 'profiles':
                return 'Profile'
            case 'location':
                return 'Location'
            default:
                return null
        }
    }

    render() {
        const {
            selector,
            items,
            showChecked,
            updateChecked,
            devices
        } = this.props

        const itemKeys = Object.keys(items)

        const { showAll } = this.state

        const size = showAll || selector !== 'profiles' ? itemKeys.length : 20

        const remaining = itemKeys.length - size

        const icon = {
            devices: DeviceIconSmall({ style: { fill: silver } }),
            profiles: ProfileIcon({ fill: silver }),
            location: LocationIcon({ fill: silver })
        }

        return (
            <div style={{ flex: '0 0 auto' }}>
                {selector !== 'devices' && (
                    <div
                        style={{
                            paddingLeft: 2,
                            paddingBottom: 17,
                            flex: '0 0 auto',
                            display: 'flex'
                        }}
                    >
                        {icon[selector]}
                        <div
                            style={{
                                marginLeft: 16,
                                ...text,
                                color: silver,
                                fontSize: 13
                            }}
                        >
                            {this.getSelector(selector)}
                        </div>
                    </div>
                )}
                {itemKeys.slice(0, size).map((item, index) => {
                    if (
                        items[item].label !== 'Profile Identifier' ||
                        items[item].selector !== 'ROVER_PROFILE'
                    ) {
                        return (
                            <div style={{ paddingBottom: 17 }} key={index}>
                                <Checkbox
                                    isChecked={showChecked(item, items[item])}
                                    label={items[item].label}
                                    primaryColor={purple}
                                    isDisabled={false}
                                    onChange={e =>
                                        updateChecked(
                                            selector,
                                            items[item],
                                            item,
                                            devices !== undefined
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
                        )
                    }
                })}
                {this.showMore(remaining)}
            </div>
        )
    }
}

ColumnDisplay.propTypes = {
    selector: PropTypes.string.isRequired,
    items: PropTypes.object.isRequired,
    updateChecked: PropTypes.func.isRequired,
    showChecked: PropTypes.func.isRequired,
    devices: PropTypes.bool
}

ColumnDisplay.defaultProps = {
    selector: '',
    items: {},
    updateChecked: () => null,
    showChecked: () => null,
    devices: undefined
}

export default ColumnDisplay
