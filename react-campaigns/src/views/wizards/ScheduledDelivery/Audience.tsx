/// <reference path="../../../../typings/index.d.ts"/>
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { parse } from 'qs'
import { connect, Dispatch } from 'react-redux'

import { updateEditableCampaign } from '../../../actions'
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
import SegmentSelector from './SegmentSelector'

export interface AudienceProps {
    device: Media
    wizardSection: keyof editableUIState
}

export interface AudienceStateProps {
    editableCampaign: ScheduledCampaign | AutomatedNotificationCampaign
}

const Audience: React.SFC<AudienceProps & AudienceStateProps> = ({
    device,
    editableCampaign
}) => {
    const { Fragment } = React

    return (
        <Fragment>
            <FormSection device={device} style={{ marginTop: 24 }}>
                <Text
                    text="Audience"
                    size="h1"
                    textStyle={{ marginBottom: 8 }}
                />
                <SegmentConditionSelector device={device} />
                <SegmentSelector device={device} />
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

export default connect(
    mapStateToProps,
    {}
)(Audience)
