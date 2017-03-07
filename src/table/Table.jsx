import React, { Component } from 'react'
import { findDOMNode } from 'react-dom'

import { flexContainer } from '../../styles/layout'

class Table extends Component {

    componentDidMount() {
        if (this.props.isLoading) {
            this.addSkeleton()
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.isLoading && !prevProps.isLoading) {
            this.addSkeleton()
        }

        if (!this.props.isLoading && prevProps.isLoading) {
            this.removeSkeleton()
        }
    }

    render() {
        const { style, children } = this.props

        let containerStyle = {
            ...Table.defaultStyles.container,
            ...style
        }

        return <div className="Table" style={containerStyle}>{children}</div>
    }

    addSkeleton() {
        const element = findDOMNode(this)

        const body = element.querySelector('.TableBody')
        if (!body) {
            return
        }

        const row = body.querySelector('.TableRow')
        if (!row) {
            return
        }

        const bodyHeight = body.getBoundingClientRect().height
        const rowHeight = row.getBoundingClientRect().height
        const numRows = Math.ceil(bodyHeight / rowHeight) - 1

        for (let i = 0; i < numRows; i++) {
            const skeletonRow = row.cloneNode(true)
            skeletonRow.classList.add('SkeletonRow')
            body.appendChild(skeletonRow)
        }
    }

    removeSkeleton() {
        const element = findDOMNode(this)

        const body = element.querySelector('.TableBody')
        if (!body) {
            return
        }

        body.querySelectorAll('.SkeletonRow').forEach(element => {
            body.removeChild(element)
        })
    }
}

Table.defaultProps = {
    style: {}
}

Table.defaultStyles = {
    container: {
        ...flexContainer
    }
}

export default Table
