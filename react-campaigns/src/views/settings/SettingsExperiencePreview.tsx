import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { connect } from 'react-redux'

import {
    getEditableCampaign,
    getCurrentWizard,
    getExperiences,
    getIsWizardModalOpen
} from '../../reducers'

export interface SettingsExperiencePreviewStateProps {
    editableCampaign: ScheduledCampaign | AutomatedNotificationCampaign
    currentWizard: UIStateType | formPage
    experiences: Array<Experience>
    isWizardModalOpen: boolean
}

export type SettingsExperiencePreviewProps = SettingsExperiencePreviewStateProps

const SettingsExperiencePreview: React.SFC<SettingsExperiencePreviewProps> = ({
    editableCampaign,
    experiences,
    isWizardModalOpen
}) => {
    const { experienceId, notificationTapBehaviorType } = editableCampaign
    if (
        !isWizardModalOpen &&
        notificationTapBehaviorType === 'OPEN_EXPERIENCE'
    ) {
        const experience = experiences.filter(
            ({ id }) => id === experienceId
        )[0]
        const simulatorURL = experience
            ? `${experience.simulatorURL}?showStatusBar=true`
            : undefined

        return (
            <React.Fragment>
                {ReactDOM.createPortal(
                    <React.Fragment>
                        <div
                            style={{
                                position: 'absolute',
                                top: 96,
                                left: 24,
                                textAlign: 'center',
                                width: 320,
                                height: 568,
                                background:
                                    'white linear-gradient(rgba(233,233,233,1.0), rgba(238,238,238,0.5))',
                                zIndex: 10
                            }}
                        />
                        <iframe
                            id="experience-preview-settings-page"
                            src={simulatorURL}
                            style={{
                                position: 'absolute',
                                top: 96,
                                zIndex: 11,
                                left: 24,
                                height: 568,
                                width: 320
                            }}
                        />
                    </React.Fragment>,
                    document.getElementById('phone-bezel')
                )}
            </React.Fragment>
        )
    }
    return null
}

const mapStateToProps = (
    state: State
): SettingsExperiencePreviewStateProps => ({
    editableCampaign: getEditableCampaign(state),
    currentWizard: getCurrentWizard(state),
    experiences: getExperiences(state),
    isWizardModalOpen: getIsWizardModalOpen(state)
})

export default connect(
    mapStateToProps,
    {}
)(SettingsExperiencePreview)
