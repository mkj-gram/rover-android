/// <reference path="../../../../typings/index.d.ts"/>
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { connect, Dispatch } from 'react-redux'
import {
    startClosingPhonePreview,
    updateActivePhonePreview
} from '../../../actions'
import {
    getIsPhonePreviewActive,
    getIsPhonePreviewClosing
} from '../../../reducers'
import PhonePreview from '../PhonePreview'

export interface PreviewPortalProps {
    children: JSX.Element
    device: Media
    title: string
}

export interface PreviewPortalStateProps {
    isPhonePreviewActive: boolean
    isPhonePreviewClosing: boolean
}

export interface PreviewPortalDispatchProps {
    updateActivePhonePreview: (preview: string) => void
    startClosingPhonePreview: () => void
}

const PreviewPortal: React.SFC<
    PreviewPortalProps & PreviewPortalDispatchProps & PreviewPortalStateProps
> = ({
    children,
    device,
    isPhonePreviewActive,
    isPhonePreviewClosing,
    startClosingPhonePreview,
    title,
    updateActivePhonePreview
}) =>
    isPhonePreviewActive && (
        <React.Fragment>
            {ReactDOM.createPortal(
                <PhonePreview
                    animation={`${
                        isPhonePreviewClosing ? 'close' : 'open'
                    } ease-out 350ms`}
                    device={device}
                    buttonLeft="Close"
                    buttonLeftCallback={() => {
                        startClosingPhonePreview()
                        setTimeout(() => updateActivePhonePreview(''), 350)
                    }}
                    previewTitle={title}
                >
                    {children}
                </PhonePreview>,
                document.getElementById('mainModalLeft')
            )}
        </React.Fragment>
    )

const mapStateToProps = (
    state: State,
    ownProps: PreviewPortalProps
): PreviewPortalStateProps => ({
    isPhonePreviewActive: getIsPhonePreviewActive(state, ownProps.title),
    isPhonePreviewClosing: getIsPhonePreviewClosing(state)
})

const mapDispatchtoProps = (
    // tslint:disable-next-line:no-any
    dispatch: Dispatch<any>
): PreviewPortalDispatchProps => ({
    updateActivePhonePreview: (preview: string) =>
        dispatch(updateActivePhonePreview(preview)),
    startClosingPhonePreview: () => dispatch(startClosingPhonePreview())
})

export default connect(
    mapStateToProps,
    mapDispatchtoProps
)(PreviewPortal)
