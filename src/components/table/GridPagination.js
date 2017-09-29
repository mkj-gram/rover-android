import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
    mercury,
    RoundedButton,
    purple,
    silver,
    text,
    titanium,
    semibold,
    violet
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
                    ? props.totalRows % 50 !== 0
                      ? Math.floor(props.totalRows / 50)
                      : Math.floor(props.totalRows / 50) - 1
                    : 0
        }
        this.calculateRange = this.calculateRange.bind(this)
        this.handlePrevious = this.handlePrevious.bind(this)
        this.handleNext = this.handleNext.bind(this)
        this.clickHoverColor = this.clickHoverColor.bind(this)
        this.compareValues = this.compareValues.bind(this)
    }

    componentWillReceiveProps(nextProps) {
        const maxPage =
            nextProps.totalRows > 50
                ? nextProps.totalRows % 50 !== 0
                  ? Math.floor(nextProps.totalRows / 50)
                  : Math.floor(nextProps.totalRows / 50) - 1
                : 0

        if (nextProps.resetPagination) {
            this.setState({ maxPage, page: 0 })
        } else {
            this.setState({ maxPage })
        }
    }

    compareValues(a, b, c) {
        return a === b && b === c && c === a
    }

    calculateRange() {
        let min, max, range
        const { totalRows } = this.props
        const { page } = this.state

        if (totalRows === 0) {
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
            this.props.updatePageNumber(page - 1)
            this.setState({ ...this.state, page: page - 1 })
        }
    }

    handleNext() {
        const { page, maxPage } = this.state
        if (page + 1 <= maxPage) {
            this.props.updatePageNumber(page + 1)
            this.setState({ ...this.state, page: page + 1 })
        }
    }

    clickHoverColor(action) {
        let color, hover
        const { page, maxPage } = this.state
        if (action === 'next') {
            color = page < maxPage ? purple : silver
            hover = page < maxPage ? violet : silver
        } else if (action === 'previous') {
            color = page > 0 ? purple : silver
            hover = page > 0 ? violet : silver
        }
        return [color, hover]
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
                    primaryColor={this.clickHoverColor('previous')[0]}
                    style={{
                        padding: 0,
                        marginRight: 10,
                        marginLeft: 9,
                        cursor: 'pointer'
                    }}
                    onClick={this.handlePrevious}
                    hoverColor={this.clickHoverColor('previous')[1]}
                >
                    Previous
                </RoundedButton>
                <RoundedButton
                    type="cancel"
                    primaryColor={this.clickHoverColor('next')[0]}
                    style={{ padding: 0, marginRight: 21, cursor: 'pointer' }}
                    onClick={this.handleNext}
                    hoverColor={this.clickHoverColor('next')[1]}
                >
                    Next
                </RoundedButton>
            </div>
        )
    }
}

GridPagination.propTypes = {
    totalRows: PropTypes.number.isRequired,
    updatePageNumber: PropTypes.func.isRequired
}

export default GridPagination
