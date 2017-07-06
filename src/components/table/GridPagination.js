import React, { Component } from 'react'
import {
    mercury,
    RoundedButton,
    purple,
    silver,
    text,
    titanium,
    semibold
} from '@rover/react-bootstrap'

const paginationContainer = {
    minWidth: 224,
    width: 'auto',
    height: 40,
    backgroundColor: mercury,
    position: 'absolute',
    bottom: 0,
    right: 0,
    display: 'flex',
    flex: '0 0 auto',
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.9
}

const paginationRows = {
    marginLeft: 19,
    marginRight: 9,
    minWidth: 79,
    width: 'auto',
    height: 18,
    ...text
}

const middleLine = {
    height: 24,
    width: 1,
    backgroundColor: titanium
}

class GridPagination extends Component {
    constructor(props) {
        super(props)
        this.state = {
            page: 0,
            maxPage:
                props.totalRows > 50
                    ? props.totalRows % 50 != 0
                      ? Math.floor(props.totalRows / 50)
                      : Math.floor(props.totalRows / 50) - 1
                    : 0
        }
        this.calculateRange = this.calculateRange.bind(this)
        this.handlePrevious = this.handlePrevious.bind(this)
        this.handleNext = this.handleNext.bind(this)
        this.clickableColor = this.clickableColor.bind(this)
        this.compareValues = this.compareValues.bind(this)
    }

    compareValues(a, b, c) {
        return a == b && b == c && c == a
    }

    calculateRange() {
        let min, max, range
        const { totalRows } = this.props
        const { page } = this.state

        if (totalRows == 0) {
            min = 0
            max = 0
        } else {
            min = page * 50 + 1
            max = page * 50 + 50 > totalRows ? totalRows : page * 50 + 50
        }

        return this.compareValues(min, max, totalRows) ||
        this.compareValues(min, max, 0)
            ? `${min}`
            : `${min}-${max}`
    }

    handlePrevious() {
        const { page } = this.state
        if (page - 1 >= 0) {
            this.setState({ ...this.state, page: page - 1 })
        }
    }

    handleNext() {
        const { page, maxPage } = this.state
        if (page + 1 <= maxPage) {
            this.setState({ ...this.state, page: page + 1 })
        }
    }

    clickableColor(action) {
        let color
        const { page, maxPage } = this.state
        if (action === 'next') {
            color = page < maxPage ? purple : silver
        } else if (action === 'previous') {
            color = page > 0 ? purple : silver
        }
        return color
    }

    render() {
        const { totalRows } = this.props

        return (
            <div style={paginationContainer}>
                <div style={paginationRows}>
                    <span style={{ ...semibold }}>
                        {this.calculateRange()}
                    </span>{' '}
                    of {totalRows >= 1000 ? `${totalRows / 1000}K` : totalRows}
                </div>
                <div style={middleLine} />
                <RoundedButton
                    type="cancel"
                    primaryColor={this.clickableColor('next')}
                    style={{ padding: 0, marginRight: 10, marginLeft: 9 }}
                    onClick={this.handleNext}
                >
                    Next
                </RoundedButton>
                <RoundedButton
                    type="cancel"
                    primaryColor={this.clickableColor('previous')}
                    style={{ padding: 0, marginRight: 21 }}
                    onClick={this.handlePrevious}
                >
                    Previous
                </RoundedButton>
            </div>
        )
    }
}

export default GridPagination
