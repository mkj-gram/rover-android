import React, { Component } from 'react'
import PropTypes from 'prop-types'

import {
    Checkbox,
    purple,
    RoundedButton,
    text,
    silver,
    light,
    violet
} from '@rover/react-bootstrap'

import { DeviceIconSmall, ProfileIcon } from '@rover/react-icons'

class ColumnDisplay extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showAll: false
        }
        this.triggerShowHide = this.triggerShowHide.bind(this)
        this.showMore = this.showMore.bind(this)
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

    render() {
        const { category, items, showChecked, updateChecked } = this.props
        const { showAll } = this.state

        const size = showAll ? items.length : 5
        const remaining = items.length - size

        const icon = {
            devices: DeviceIconSmall({ style: { fill: silver } }),
            profiles: ProfileIcon({ fill: silver })
        }

        return (
            <div style={{ flex: '0 0 auto' }}>
                <div
                    style={{
                        paddingLeft: 2,
                        paddingBottom: 17,
                        flex: '0 0 auto',
                        display: 'flex'
                    }}
                >
                    {icon[category]}
                    <div
                        style={{
                            marginLeft: 16,
                            ...text,
                            color: silver,
                            fontSize: 13
                        }}
                    >
                        {category}
                    </div>
                </div>
                {items.slice(0, size).map((item, index) =>
                    (<div style={{ paddingBottom: 17 }} key={index}>
                        <Checkbox
                            isChecked={showChecked(item)}
                            label={item}
                            primaryColor={purple}
                            isDisabled={false}
                            onChange={e => updateChecked(category, item)}
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
                    </div>)
                )}
                {this.showMore(remaining)}
            </div>
        )
    }
}

ColumnDisplay.propTypes = {
    category: PropTypes.string.isRequired,
    items: PropTypes.array.isRequired,
    updateChecked: PropTypes.func.isRequired,
    showChecked: PropTypes.func.isRequired
}

ColumnDisplay.defaultProps = {
    category: '',
    items: [],
    updateChecked: () => null,
    showChecked: () => null
}

export default ColumnDisplay
