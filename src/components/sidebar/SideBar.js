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
import GeofenceInput from './GeofenceInput'
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
            modalCoordinates: [0, 0],
            isViewingDynamicSegment: true,
            segmentId: '',
            saveStates: {},
            sbDynamicSegment: [],
            segmentIdRefetch: false,
            isFilterModalSuccessDisabled: false
        }

        this.setState = this.setState.bind(this)
        this.handleAddButton = this.handleAddButton.bind(this)
        this.handleEditModal = this.handleEditModal.bind(this)

        this.handleSegmentAction = this.handleSegmentAction.bind(this)
        this.viewDynamicSegment = this.viewDynamicSegment.bind(this)
        this.handleModalOpen = this.handleModalOpen.bind(this)
        this.removeNullPredicate = this.removeNullPredicate.bind(this)
        this.getPredicateKeywords = this.getPredicateKeywords.bind(this)
        this.shouldDisableFilterModalSuccessButton = this.shouldDisableFilterModalSuccessButton.bind(
            this
        )
    }

    componentWillReceiveProps(nextProps) {
        const { segmentId, sbDynamicSegment } = this.state

        if (nextProps.refetchData) {
            if (
                segmentId !== nextProps.segment.segmentId ||
                (nextProps.segmentIdRefetch && this.state.segmentIdRefetch)
            ) {
                const { relay } = this.props
                const refetchVariables = fragmentVariables => ({
                    segmentId: nextProps.segment.segmentId
                })
                relay.refetch(refetchVariables, null)

                this.setState({
                    segmentId: nextProps.segment.segmentId,
                    segmentIdRefetch: false
                })
            } else if (
                nextProps.data.sbDynamicSegment[0] !== null &&
                (JSON.stringify(nextProps.data.sbDynamicSegment) !==
                    JSON.stringify(sbDynamicSegment) ||
                    nextProps.segmentIdRefetch)
            ) {
                this.viewDynamicSegment(nextProps.data)
            }
        } else {
            this.setState({
                segmentId: nextProps.segment.segmentId,
                segmentIdRefetch: true,
                sbDynamicSegment: []
            })
        }

        if (nextProps.reset) {
            this.setState({
                currentAttribute: { attribute: '', index: null },
                currentPredicate: {},
                isShowingAddFilterModal: false,
                query: [],
                modalCoordinates: [0, 0],
                isViewingDynamicSegment: true,
                segmentId: '',
                saveStates: {},
                sbDynamicSegment: [],
                refetchData: false,
                segmentIdRefetch: false
            })
        }
    }

    viewDynamicSegment(data) {
        const { sbDynamicSegment } = data
        const { predicates } = sbDynamicSegment[0]
        const { condition, device, profile } = predicates

        const query = device
            .map(d => ({ ...d, category: 'device' }))
            .concat(profile.map(p => ({ ...p, category: 'profile' })))

        this.props.setQueryCondition(condition, true, query)

        this.setState({
            query,
            sbDynamicSegment
        })
    }

    updateQuery() {
        const { updateQuery, queryCondition } = this.props
        const { query, currentPredicate } = this.state
        const { index, ...rest } = currentPredicate

        const newQuery = query
        newQuery[index] = rest
        updateQuery(newQuery, queryCondition)

        this.setState({
            query: newQuery,
            currentAttribute: { attribute: '', index: null },
            isViewingDynamicSegment: false
        })
    }

    removePredicate(indexToDelete) {
        const { query } = this.state
        const { queryCondition } = this.props

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

        const { attribute, index, category } = currentAttribute

        if (attribute === '') {
            return
        }

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

        const updateFn = currentPredicate => {
            this.setState({
                currentPredicate,
                isFilterModalSuccessDisabled: this.shouldDisableFilterModalSuccessButton(
                    currentPredicate
                )
            })
        }

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
            case 'GeofencePredicate':
                return <GeofenceInput {...props} />
            case 'FloatPredicate':
                return <NumericInput {...props} float={true} />
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
        } else if (query.length > 6) {
            const predicateListId = document.getElementById('predicateList')
            predicateListId.scrollTop = predicateListId.scrollHeight
            const lastPredicate = predicateListId.children[query.length - 1]
            const { left } = lastPredicate.getBoundingClientRect()
            modalCoordinates[0] = left
            modalCoordinates[1] = 'calc(50% + 32px)'
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
        const { isShowingAddFilterModal, query } = this.state

        const addPredicateIndex = query.length

        const { data, queryCondition } = this.props

        const style = {
            height: 58,
            width: '100%',
            backgroundColor: slate,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            flex: 'none',
            position: 'relative'
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
        const onSelect = e => {
            e.target.blur()
            e.target.parentElement.style.backgroundColor = slate
        }

        const renderArrow = () =>
            <svg
                width="6"
                height="20"
                viewBox="0 0 6 20"
                style={{
                    left: 300,
                    position: 'absolute',
                    zIndex: 1
                }}
            >
                <polygon
                    fill={slate}
                    fillRule="evenodd"
                    points="300 84 305.799 93.731 300 103.462"
                    transform="translate(-300 -84)"
                />
            </svg>

        return (
            <div style={style} id="filterContainer">
                {renderArrow()}
                <div
                    onClick={this.handleAddButton}
                    style={{
                        display: 'flex',
                        alignItems: 'center'
                    }}
                >
                    <AddButton
                        id="add-filter-button"
                        primaryColor={orchid}
                        style={{ root: { marginLeft: 20 } }}
                    />
                    <div
                        style={{
                            ...text,
                            fontSize: 15,
                            color: lavender,
                            fontWeight: 'normal'
                        }}
                    >
                        Add Filter
                    </div>
                </div>
                {isShowingAddFilterModal &&
                    <AddFilterModal
                        schema={data.segmentSchema}
                        onRequestClose={() =>
                            this.setState({ isShowingAddFilterModal: false })}
                        onSelect={predicate => {
                            this.setState({
                                query: query.concat(predicate),
                                isShowingAddFilterModal: false,
                                currentAttribute: {
                                    attribute: predicate.attribute,
                                    index: addPredicateIndex,
                                    category: predicate.category
                                }
                            })
                        }}
                    />}
                <div style={selectContainerStyle}>
                    <label style={matchStyle} htmlFor="any-all-select">
                        MATCH
                    </label>
                    <Select
                        id="any-all-select"
                        style={selectStyle}
                        isDisabled={false}
                        value={queryCondition}
                        onChange={e => {
                            onSelect(e)
                            this.props.setQueryCondition(
                                e.target.value,
                                false,
                                query
                            )
                        }}
                        onFocus={onFocus}
                    >
                        <option value="ALL">ALL</option>
                        <option value="ANY">ANY</option>
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
        const { showSaveButton } = this.props.saveStates

        return (
            <div style={style} id="saveBar">
                <RoundedButton
                    type="primary"
                    primaryColor={violet}
                    hoverColor={orchid}
                    onClick={() => this.handleSegmentAction('save')}
                    isDisabled={!showSaveButton}
                    style={{
                        width: 88,
                        marginRight: 5,
                        disabledTextColor: steel,
                        disabledBackgroundColor: graphite
                    }}
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
                        position: 'absolute',
                        zIndex: 1
                    }}
                />
            )
        }
    }

    getPredicateKeywords(currentPredicate = null) {
        const { query } = this.state
        const elem = currentPredicate || query[query.length - 1]
        const typename = elem.__typename
        const value =
            typename.slice(0, typename.indexOf('Predicate')).toLowerCase() +
            'Value'

        return { elem, value }
    }

    removeNullPredicate() {
        const { elem, value } = this.getPredicateKeywords()
        const { query } = this.state

        if (!elem.hasOwnProperty(value)) {
            query.splice(-1, 1)
            this.setState({
                query,
                currentAttribute: { attribute: '' }
            })
        } else {
            this.setState({ currentAttribute: { attribute: '' } })
        }
    }

    shouldDisableFilterModalSuccessButton(currentPredicate) {
        const { value } = this.getPredicateKeywords(currentPredicate)
        return currentPredicate[value].length === 0
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
            modalCoordinates,
            isShowingAddFilterModal,
            showSegmentSelection,
            showSegmentSave
        } = this.state

        const {
            data,
            getSegment,
            segment,
            saveStates,
            setSegment,
            updateSegmentName,
            archiveSegment,
            reset,
            queryCondition
        } = this.props

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
                    cancelFn={() => this.removeNullPredicate()}
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
                    successButtonIsDisabled={
                        this.state.isFilterModalSuccessDisabled
                    }
                    bodyOpenClassName="bodyClassName"
                    buttonStyle={{
                        disabledBackgroundColor: steel,
                        disabledTextColor: silver
                    }}
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
                                  onClick={this.handleAddButton}
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
                    showSegmentSelection={showSegmentSelection}
                    showSegmentSave={showSegmentSave}
                    handleSegmentAction={this.handleSegmentAction}
                    segments={data.segmentsContainer}
                    getSegment={getSegment}
                    segment={segment}
                    saveStates={saveStates}
                    setSegment={setSegment}
                    updateSegmentName={updateSegmentName}
                    archiveSegment={archiveSegment}
                    reset={reset}
                    queryCondition={queryCondition}
                />
            </div>
        )
    }
}

SideBar.propTypes = {
    data: PropTypes.object.isRequired,
    relay: PropTypes.object.isRequired,
    getSegment: PropTypes.func.isRequired,
    segment: PropTypes.object,
    updateQuery: PropTypes.func.isRequired,
    refetchData: PropTypes.bool.isRequired,
    segmentIdRefetch: PropTypes.bool,
    reset: PropTypes.bool.isRequired,
    saveStates: PropTypes.object.isRequired,
    setSegment: PropTypes.func.isRequired,
    updateSegmentName: PropTypes.func.isRequired,
    archiveSegment: PropTypes.func.isRequired,
    setQueryCondition: PropTypes.func.isRequired,
    queryCondition: PropTypes.string.isRequired
}

SideBar.defaultProps = {
    segment: {},
    segmentIdRefetch: false
}

export default createRefetchContainer(
    SideBar,
    graphql.experimental`
        fragment SideBar on Query
            @argumentDefinitions(segmentId: { type: "ID", defaultValue: "" }) {
            sbDynamicSegment: dynamicSegment(segmentId: $segmentId) {
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
                                    name
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
                                    name
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
    `,
    graphql.experimental`
        query SideBarRefetchQuery($segmentId: ID) {
            ...SideBar @arguments(segmentId: $segmentId)
        }
    `
)
