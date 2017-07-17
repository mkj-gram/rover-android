import React, { Component } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import {
    AddButton,
    ash,
    ModalWithHeader,
    graphite,
    onyx,
    RoundedButton,
    text,
    light,
    bold,
    steel,
    silver,
    violet,
    lavender,
    orchid,
    Select,
    slate,
    RadioButton
} from '@rover/react-bootstrap'

import { DeviceIconSmall, ProfileIcon } from '@rover/react-icons'

import AddFilterModal from './AddFilterModal'
import BooleanInput from './BooleanInput'
import DateInput from './DateInput'
import NumericInput from './NumericInput'
import StringInput from './StringInput'
import VersionInput from './VersionInput'
import FunnelAnimation from './FunnelAnimation'

import PredicateList from './PredicateList'

class SideBar extends Component {
    constructor(props) {
        super(props)

        this.state = {
            currentAttribute: { attribute: '', index: null },
            currentPredicate: {},
            isShowingAddFilterModal: false,
            query: [],
            modalCoordinates: [0, 0]
        }

        this.setState = this.setState.bind(this)
        this.handleAddButton = this.handleAddButton.bind(this)
        this.handleEditModal = this.handleEditModal.bind(this)
    }

    updateQuery() {
        const { query, currentPredicate } = this.state
        const { index, ...rest } = currentPredicate

        let newQuery = query
        newQuery[index] = rest

        this.setState({
            query: newQuery,
            currentAttribute: { attribute: '', index: null }
        })
    }

    removePredicate(indexToDelete) {
        const { query } = this.state

        const newQuery = query.filter(
            (predicate, index) => index !== indexToDelete
        )

        this.setState({ query: newQuery })
    }

    renderModalTitle(currentAttribute) {
        const { query } = this.state

        if (query.length === 0) {
            return
        }

        const { attribute, index } = currentAttribute

        if (attribute === '') {
            return
        }

        const category = query[index].category

        const icon = category === 'profile' ? ProfileIcon : DeviceIconSmall

        return (
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center'
                }}
            >
                {icon({
                    style: {
                        fill: steel,
                        verticalAlign: 'middle',
                        marginRight: 10
                    }
                })}
                <span
                    style={{
                        ...text,
                        fontWeight: 600,
                        color: 'white',
                        marginRight: 5
                    }}
                >
                    {attribute}
                </span>
                <span style={{ ...text, ...light, color: silver }}>filter</span>
            </div>
        )
    }

    renderModalInput(index) {
        const { query } = this.state
        const predicate = query[index]

        if (!predicate) {
            return
        }

        const { type } = predicate

        const updateFn = currentPredicate => this.setState({ currentPredicate })

        const props = { ...predicate, updateFn, index }

        switch (type) {
            case 'boolean':
                return <BooleanInput {...props} />
                break
            case 'date':
                return <DateInput {...props} />
                break
            case 'version':
                return <VersionInput {...props} />
                break
            case 'string':
                return <StringInput {...props} />
                break
            case 'number':
                return <NumericInput {...props} />
                break
            default:
                return
        }
    }

    handleAddButton() {
        let { modalCoordinates, query } = this.state
        
        if (query.length === 0 ) {
            const filterContainer = document.getElementById('filterContainer')
            const { left, top } = filterContainer.getBoundingClientRect()
            modalCoordinates[0] = left + 20
            modalCoordinates[1] = top + 77
        } else {
            const predicateListId = document.getElementById('predicateList')
            const lastPredicate = predicateListId.children[query.length - 1]
            const { left, top } = lastPredicate.getBoundingClientRect()
            modalCoordinates[0] = left
            modalCoordinates[1] = top + lastPredicate.offsetHeight + 32
        }
        this.setState({
            modalCoordinates: modalCoordinates,
            isShowingAddFilterModal: true
        })
    }

    renderAddFilterBar() {
        const { isShowingAddFilterModal, query } = this.state
        const addPredicateIndex = query.length

        const style = {
            height: 58,
            width: '100%',
            backgroundColor: slate,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            flex: 'none'
        }

        const selectStyle = {
            backgroundColor: slate,
            border: 'none',
            borderRadius: 3,
            width: 95,
            height: 30
        }

        const onFocus = e => (e.target.style.backgroundColor = graphite)
        const onBlur = e => (e.target.style.backgroundColor = slate)

        return (
            <div style={style} id="filterContainer">
                <AddButton
                    id="add-filter-button"
                    primaryColor={orchid}
                    style={{ root: { marginLeft: 20 } }}
                    onClick={this.handleAddButton}
                />
                <label
                    style={{
                        ...text,
                        fontSize: 15,
                        color: lavender,
                        fontWeight: 'normal'
                    }}
                    htmlFor="add-filter-button"
                >
                    Add Filter
                </label>
                {isShowingAddFilterModal &&
                    <AddFilterModal
                        onRequestClose={() =>
                            this.setState({ isShowingAddFilterModal: false })}
                        onSelect={predicate => {
                            this.setState({
                                query: query.concat(predicate),
                                isShowingAddFilterModal: false,
                                currentAttribute: {
                                    attribute: predicate.attribute,
                                    index: addPredicateIndex
                                }
                            })
                        }}
                    />} 
                <div style={{ marginLeft: 'auto', marginRight: 30 }}>
                    <Select
                        style={selectStyle}
                        isDisabled={false}
                        value={'all'}
                        onChange={e => console.log(e.target.value)}
                        onFocus={onFocus}
                        onBlur={onBlur}
                    >
                        <option value="all" label="Match all">
                            all
                        </option>
                        <option value="any" label="Match any">
                            any
                        </option>
                    </Select>
                </div>
            </div>
        )
    }

    renderSaveBar() {
        const style = {
            height: 75,
            width: 300,
            backgroundColor: slate,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flex: 'none'
        }

        return (
            <div style={style}>
                <RoundedButton
                    type="primary"
                    primaryColor={violet}
                    hoverColor={orchid}
                    style={{
                        width: 88,
                        marginRight: 5
                    }}
                >
                    Save
                </RoundedButton>
                <RoundedButton
                    type="primary"
                    primaryColor={graphite}
                    hoverColor={ash}
                    style={{
                        width: 160,
                        marginLeft: 5,
                        display: 'flex',
                        alignItems: 'center'
                    }}
                >
                    <div
                        style={{
                            backgroundColor: violet,
                            color: 'white',
                            height: 22,
                            width: 22,
                            borderRadius: 11,
                            fontSize: 11,
                            marginRight: 5,
                            lineHeight: '22px',
                            pointerEvents: 'none'
                        }}
                    >
                        16
                    </div>
                    My Segments
                </RoundedButton>
            </div>
        )
    }

    handleEditModal(attribute, index) {
        const { left, top } = document
            .getElementById('predicateList')
            .children[index].getBoundingClientRect()

        this.setState({
            currentAttribute: { attribute, index },
            modalCoordinates: [left, top]
        })
    }

    render() {
        const sideBarStyle = {
            height: '100%',
            width: 300,
            flex: '0 0 auto',
            backgroundColor: graphite,
            display: 'flex',
            flexDirection: 'column'
        }
        const {
            currentAttribute,
            currentPredicate,
            query,
            modalCoordinates
        } = this.state
        return (
            <div style={sideBarStyle}>
                <ModalWithHeader
                    contentLabel="Query Builder"
                    backgroundColor={graphite}
                    isOpen={currentAttribute.attribute !== ''}
                    headerContent={this.renderModalTitle(currentAttribute)}
                    successFn={() => this.updateQuery()}
                    successText="Add filter"
                    cancelFn={() =>
                        this.setState({ currentAttribute: { attribute: '' } })}
                    cancelText="Cancel"
                    primaryColor={violet}
                    secondaryColor={lavender}
                    hoverColor={orchid}
                    modalContentStyle={{
                        bottom: null,
                        padding: 0,
                        right: null,
                        top: modalCoordinates[1],
                        left: modalCoordinates[0],
                        transform: null
                    }}
                    modalOverlayStyle={{
                        height: '100%',
                        width: '100%'
                    }}
                    bodyOpenClassName="bodyClassName"
                >
                    {currentAttribute.attribute !== ''
                        ? this.renderModalInput(currentAttribute.index)
                        : <div />}
                </ModalWithHeader>
                {this.renderAddFilterBar()}
                {query.length > 0
                    ? <PredicateList
                          query={query}
                          removePredicate={index => this.removePredicate(index)}
                          viewModal={(attribute, index) =>
                              this.handleEditModal(attribute, index)}
                      />
                    : <div
                          style={{
                              ...text,
                              color: silver,
                              margin: '30px auto',
                              width: 210,
                              height: '100%',
                              textAlign: 'center'
                          }}
                      >
                          <FunnelAnimation />
                          <div style={{ marginBottom: 30 }}>
                              <span
                                  style={{
                                      color: lavender,
                                      marginRight: 5,
                                      cursor: 'pointer'
                                  }}
                              >
                                  Add a filter
                              </span>
                              to start building segments based on your audience
                              data
                          </div>
                          <div>
                              When you're done with it, just{' '}
                              <span style={{ color: 'white' }}>Save</span> it
                              for later use
                          </div>
                      </div>}
                {query.length > 0 && this.renderSaveBar()}
            </div>
        )
    }
}

export default SideBar
