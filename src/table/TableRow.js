import React, { Component, PropTypes, cloneElement } from 'react'

import { straw } from '../../../common/styles/colors'

class TableRow extends Component {

    constructor(props) {
        super(props)

        this.state = {
            isOver: false
        }
    }

    render() {
        const { isHead, onClick, children } = this.props
            
        const numChildren = React.Children.count(children)
        let i = 0
        const cells = React.Children.map(children, element => {
            const isFirst = i === 0
            const isLast = i === numChildren - 1
            i++

            return cloneElement(element, {
                isFirst: isFirst,
                isLast: isLast,
                isHead: isHead
            })
        })

        return (
            <div 
                className="TableRow" 
                style={this.getStyle()} 
                onMouseEnter={e => this.setState({ isOver: true })}
                onMouseLeave={e => this.setState({ isOver: false })}
                onClick={e => onClick ? onClick(e) : null}
            >
                {cells}
            </div>
        )
    }

    getStyle() {
        const { isHead, onClick, style } = this.props

        let declarations = {
            backgroundColor: 'white',
            display: 'flex',
            height: 60,
            marginBottom: 1
        }

        if (isHead) {
            declarations = {
                ...declarations,
                backgroundColor: 'transparent',
                height: 65,
                paddingTop: 15  
            }
        }

        const { isOver } = this.state

        if (isOver && onClick) {
            declarations = {
                ...declarations,
                backgroundColor: straw
            }
        }

        return {
            ...declarations,
            ...style
        }
    }
}

TableRow.propTypes = {
    isHead: PropTypes.bool.isRequired,
    onClick: PropTypes.func,
    style: PropTypes.object
}

TableRow.defaultProps = {
    isHead: false
}

export default TableRow
