import React, { Component, PropTypes } from 'react'
import { text, semibold, large } from './styles/typography'
import { HomeIcon } from '@rover/react-icons'

class PrimaryNavigator extends Component {
    constructor(props) {
        super(props)
        
        this.renderSelectors = this.renderSelectors.bind(this)
    }
    renderSelectors() {
        const { color, onClick, selectors } = this.props

        return selectors.map(({ icon, title, isSelected, path }, index) =>
                <div
                  key={index}
                  style={{
                      ...text,
                      ...semibold,
                      ...large,
                      flex: '1 1 auto',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: isSelected ? color : 'rgba(0, 0, 0, 0)',
                      height: '100%',
                      borderLeft: index > 0 && `1px solid ${color}`,
                      color: isSelected ? 'white' : color
                  }}
                  onClick={e =>{
                      onClick(path)
                  }}
                >
                    {icon({fill: `${isSelected ? 'white' : color}`})}
                    <div style={{ marginLeft: 10 }}>{title}</div>
                </div>
        )
    }

    render () {
        
        const { color, buttons, navigatorStyle } = this.props
        const style = {
            height: 40,
            border: `1px solid ${color}`,
            borderRadius: 4,
            display: 'flex',
            overflow: 'hidden',
            ...navigatorStyle
        }
        return (
            <div style={style}>{this.renderSelectors()}</div>
        )
    }
}

PrimaryNavigator.propTypes = {
    color: PropTypes.string.isRequired,
    navigatorStyle: PropTypes.object,
    onClick: PropTypes.func.isRequired,
    path: PropTypes.string.isRequired,
    selectors: PropTypes.arrayOf(
        PropTypes.shape({
            icon: PropTypes.func,
            title: PropTypes.string,
            isSelected: PropTypes.bool
        })
    )
}

PrimaryNavigator.defaultProps = {
    color: '#000',
    navigatorStyle: { width: 400 },
    onClick: path => console.log(`Path: ${path}`),
    path: 'nopath',
    selectors: [
        {
            icon: HomeIcon,
            title: 'TEST',
            isSelected: false
        },
        {
            icon: HomeIcon,
            title: 'TEST 2',
            isSelected: true
        },
        {
            icon: HomeIcon,
            title: 'TEST 3',
            isSelected: false
        }
    ]
}

export default PrimaryNavigator
