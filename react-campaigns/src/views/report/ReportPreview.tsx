import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import MediaQuery from 'react-responsive'

import { getExperiencePreviewURL } from '../../reducers'

export interface ReportPreviewProps {
    campaignId: string
}
export interface ReportPreviewStateProps {
    simulatorURL: string
}

const ReportPreview: React.SFC<
    ReportPreviewProps & ReportPreviewStateProps
> = ({ simulatorURL }) => {
    return (
        <MediaQuery minWidth={1140}>
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
                        id="experience-preview-report-page"
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
        </MediaQuery>
    )
}

const mapStateToProps = (
    state: State,
    ownProps: ReportPreviewProps
): ReportPreviewStateProps => ({
    simulatorURL: getExperiencePreviewURL(state, ownProps.campaignId)
})

export default connect(
    mapStateToProps,
    {}
)(ReportPreview)
