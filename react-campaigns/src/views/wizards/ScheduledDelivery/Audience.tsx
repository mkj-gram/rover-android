/// <reference path="../../../../typings/index.d.ts"/>
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { parse } from 'qs'
import { connect, Dispatch } from 'react-redux'

import { fetchNextAudienceSize, updateEditableCampaign } from '../../../actions'
import { getEditableCampaign, getCampaign } from '../../../reducers'

import {
    aquamarine,
    Button,
    ChangeIcon,
    charcoal,
    semibold,
    steel,
    Text,
    titanium,
    turquoise
} from '@rover/ts-bootstrap/dist/src'

import AudienceLink from '../components/AudienceLink'
import FormSection from '../../utils/FormSection'
import Row from '../components/Row'
import SegmentConditionSelector from './SegmentConditionSelector'

export interface AudienceProps {
    device: Media
    wizardSection: keyof editableUIState
}

export interface AudienceStateProps {
    editableCampaign: ScheduledCampaign | AutomatedNotificationCampaign
}

export interface AudienceDispatchProps {
    fetchNextAudienceSize: (segmentId: string, condition: 'ANY' | 'ALL') => void
}

const Audience: React.SFC<
    AudienceProps & AudienceStateProps & AudienceDispatchProps
> = ({ device, editableCampaign, fetchNextAudienceSize }) => {
    const { Fragment } = React

    return (
        <Fragment>
            <FormSection device={device} style={{ marginTop: 24 }}>
                <Text text="Audience" size="h1" />
                <SegmentConditionSelector device={device} />
            </FormSection>
            {device === 'Desktop' &&
                ReactDOM.createPortal(
                    <AudienceLink
                        primaryText="Segments are managed in the Rover Audience App"
                        secondaryText="Manage Segments"
                        style={{ width: 220 }}
                    />,
                    document.getElementById('mainModalRight')
                )}
        </Fragment>
    )
}

const mapStateToProps = (state: State): AudienceStateProps => ({
    editableCampaign: getEditableCampaign(state)
})

const mapDispatchToProps = (
    // tslint:disable-next-line:no-any
    dispatch: Dispatch<any>
): AudienceDispatchProps => {
    return {
        fetchNextAudienceSize: (segmentId: string, condition: 'ANY' | 'ALL') =>
            dispatch(fetchNextAudienceSize(segmentId, condition))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Audience)
