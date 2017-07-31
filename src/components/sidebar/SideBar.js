import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { graphql, createRefetchContainer } from 'react-relay'
import {
    AddButton,
    ash,
    ModalWithHeader,
    graphite,
    RoundedButton,
    text,
    light,
    steel,
    silver,
    violet,
    lavender,
    orchid,
    Select,
    slate
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

import SegmentsContainer from './SegmentsContainer'

class SideBar extends Component {
    constructor(props) {
        super(props)
        this.state = {
            currentAttribute: { attribute: '', index: null },
            currentPredicate: {},
            isShowingAddFilterModal: false,
            query: [],
            queryCondition: 'all',
            modalCoordinates: [0, 0],
            isViewingDynamicSegment: true,
            segmentId: ''
        }

        this.setState = this.setState.bind(this)
        this.handleAddButton = this.handleAddButton.bind(this)
        this.handleEditModal = this.handleEditModal.bind(this)

        this.handleSegmentAction = this.handleSegmentAction.bind(this)
        this.viewDynamicSegment = this.viewDynamicSegment.bind(this)
        this.handleModalOpen = this.handleModalOpen.bind(this)
    }

    componentWillReceiveProps(nextProps) {
        if (this.state.segmentId !== nextProps.segmentId) {
            const { relay } = this.props
            const refetchVariables = fragmentVariables => ({
                segmentId: nextProps.segmentId
            })
            relay.refetch(refetchVariables, null)

            this.setState({ segmentId: nextProps.segmentId })
        } else if (nextProps.data.sbDynamicSegment !== null) {
            this.viewDynamicSegment(nextProps.data)
        }
    }

    viewDynamicSegment(data) {
        const { sbDynamicSegment } = data
        const { predicates } = sbDynamicSegment[0]
        const { condition, device, profile } = predicates

        const query = device.map(d => ({ ...d, category: 'device' })).concat(profile.map(p => ({ ...p, category: 'profile' })))
        this.setState({
            query,
            queryCondition: condition
        })
    }

    updateQuery() {
        const { query, currentPredicate, queryCondition } = this.state
        const { index, ...rest } = currentPredicate

        const newQuery = query
        newQuery[index] = rest

        this.props.updateQuery(newQuery, queryCondition)
        this.setState({
            query: newQuery,
            currentAttribute: { attribute: '', index: null },
            isViewingDynamicSegment: false
        })
    }

    removePredicate(indexToDelete) {
        const { query, queryCondition } = this.state

        const newQuery = query.filter(
            (predicate, index) => index !== indexToDelete
        )

        this.props.updateQuery(newQuery, queryCondition)
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

        const { __typename } = predicate

        const updateFn = currentPredicate => this.setState({ currentPredicate })

        const props = { ...predicate, updateFn, index }

        switch (__typename) {
            case 'BooleanPredicate':
                return <BooleanInput {...props} />
            case 'DatePredicate':
                return <DateInput {...props} />
            case 'VersionPredicate':
                return <VersionInput {...props} />
            case 'StringPredicate':
                return <StringInput {...props} />
            case 'NumberPredicate':
                return <NumericInput {...props} />
            default:
        }
    }

    handleAddButton() {
        const { modalCoordinates, query } = this.state

        if (query.length === 0) {
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
            modalCoordinates,
            isShowingAddFilterModal: true
        })
    }

    renderAddFilterBar() {
        const { isShowingAddFilterModal, query, queryCondition } = this.state
        const addPredicateIndex = query.length

        const { data } = this.props

        const style = {
            height: 58,
            width: '100%',
            backgroundColor: slate,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            flex: 'none'
        }

        const selectContainerStyle = {
            marginLeft: 'auto',
            marginRight: 30,
            display: 'flex',
            alignItems: 'center',
            height: 27,
            padding: '0 15px',
            borderRadius: 3
        }

        const selectStyle = {
            backgroundColor: 'transparent',
            border: 'none',
            borderRadius: 3,
            width: 36,
            height: 21,
            color: lavender,
            fontSize: 12,
            padding: '1px 0 3px 0'
        }

        const matchStyle = {
            ...text,
            color: silver,
            fontSize: 12,
            fontWeight: 600,
            marginRight: 3
        }

        const onFocus = e =>
            (e.target.parentElement.style.backgroundColor = graphite)
        const onSelect = e =>
            (e.target.parentElement.style.backgroundColor = slate)

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
                        schema={data.segmentSchema}
                        onRequestClose={() =>
                            this.setState({ isShowingAddFilterModal: false })}
                        onSelect={(predicate) => {
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
                <div style={selectContainerStyle}>
                    <span style={matchStyle}>MATCH</span>
                    <Select
                        style={selectStyle}
                        isDisabled={false}
                        value={queryCondition}
                        onChange={(e) => {
                            onSelect(e)
                            this.setState({ queryCondition: e.target.value })
                        }}
                        onFocus={onFocus}
                    >
                        <option value="all" label="ALL">
                            all
                        </option>
                        <option value="any" label="ANY">
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
            <div style={style} id="saveBar">
                <RoundedButton
                    type="primary"
                    primaryColor={violet}
                    hoverColor={orchid}
                    style={{
                        width: 88,
                        marginRight: 5
                    }}
                    onClick={() => this.handleSegmentAction('save')}
                >
                    Save
                </RoundedButton>
                <RoundedButton
                    type="primary"
                    primaryColor={graphite}
                    hoverColor={ash}
                    onClick={() => this.handleSegmentAction('selection')}
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
                        {this.props.data.segmentsContainer.length}
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

    handleSegmentAction(val) {
        if (val === 'selection') {
            this.setState({
                showSegmentSelection: !this.state.showSegmentSelection
            })
        } else {
            this.setState({
                showSegmentSave: !this.state.showSegmentSave
            })
        }
    }

    handleModalOpen() {
        const {
            isShowingAddFilterModal,
            showSegmentSelection,
            showSegmentSave
        } = this.state
        if (
            isShowingAddFilterModal ||
            showSegmentSelection ||
            showSegmentSave
        ) {
            return (
                <div
                    style={{
                        height: '100%',
                        width: 300,
                        flex: '0 0 auto',
                        background: 'rgba(0,0,0,0.3)',
                        position: 'absolute'
                    }}
                />
            )
        }
    }

    render() {
        const sideBarStyle = {
            height: '100%',
            width: 300,
            flex: '0 0 auto',
            backgroundColor: graphite,
            display: 'flex',
            flexDirection: 'column',
            position: 'relative'
        }
        const {
            currentAttribute,
            query,
            queryCondition,
            modalCoordinates,
            isShowingAddFilterModal,
            showSegmentSelection,
            showSegmentSave
        } = this.state

        return (
            <div style={sideBarStyle}>
                {this.handleModalOpen()}

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
                          queryCondition={queryCondition}
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
                          <FunnelAnimation
                              isModalOpen={
                                  isShowingAddFilterModal ||
                                  showSegmentSelection ||
                                  showSegmentSave
                              }
                          />
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
                              When you&apos;re done with it, just{' '}
                              <span style={{ color: 'white' }}>Save</span> it
                              for later use
                          </div>
                      </div>}
                {this.renderSaveBar()}
                <SegmentsContainer
                    query={query}
                    showSegmentSelection={this.state.showSegmentSelection}
                    showSegmentSave={this.state.showSegmentSave}
                    handleSegmentAction={this.handleSegmentAction}
                    segments={this.props.data.segmentsContainer}
                    getSegmentId={this.props.getSegmentId}
                />
            </div>
        )
    }
}

SideBar.propTypes = {
    data: PropTypes.object.isRequired,
    relay: PropTypes.object.isRequired,
    getSegmentId: PropTypes.func.isRequired,
    segmentId: PropTypes.string,
    updateQuery: PropTypes.func.isRequired
}

SideBar.defaultProps = {
    segmentId: ''
}

export default createRefetchContainer(
    SideBar,
    graphql.experimental`
        fragment SideBar on Query
        @argumentDefinitions(
            segmentId: {type: "ID", defaultValue: ""}
        ) {
             sbDynamicSegment: dynamicSegment(
                segmentId: $segmentId,
                paginationKey: "testpaginationkey"
            ){
                segmentId
                name
                predicates {
                    condition
                    device {
                        ... on Predicate {
                            __typename
                            attribute
                            ... on StringPredicate {
                                stringValue
                                stringComparison
                            }
                            ... on VersionPredicate {
                                versionValue
                                versionComparison
                            }
                            ... on DatePredicate {
                                dateValue {
                                    start
                                    end
                                }
                                dateComparison
                            }
                            ... on BooleanPredicate {
                                booleanValue
                                booleanComparison
                            }
                            ... on NumberPredicate {
                                numberValue
                                numberComparison
                            }
                            ... on GeofencePredicate {
                                geofenceValue {
                                    latitude
                                    longitude
                                    radius
                                }
                                geofenceComparison
                            }
                        }
                    }
                    profile {
                        ... on Predicate {
                            __typename
                            attribute
                            ... on StringPredicate {
                                stringValue
                                stringComparison
                            }
                            ... on VersionPredicate {
                                versionValue
                                versionComparison
                            }
                            ... on DatePredicate {
                                dateValue {
                                    start
                                    end
                                }
                                dateComparison
                            }
                            ... on BooleanPredicate {
                                booleanValue
                                booleanComparison
                            }
                            ... on NumberPredicate {
                                numberValue
                                numberComparison
                            }
                            ... on GeofencePredicate {
                                geofenceValue {
                                    latitude
                                    longitude
                                    radius
                                }
                                geofenceComparison
                            }
                        }
                    }
                }
            }
            segmentSchema {
                ...AddFilterModal_schema
            }

            segmentsContainer: dynamicSegment {
                ...SegmentsContainer_segments
            }
        }
    `
    ,
    graphql.experimental`
        query SideBarRefetchQuery($segmentId: ID){     
            ...SideBar @arguments(segmentId: $segmentId)
        }
    `
)
