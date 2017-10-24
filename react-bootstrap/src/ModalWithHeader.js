import React from 'react'
import PropTypes from 'prop-types'
import Modal from './Modal'
import RoundedButton from './RoundedButton'
import { graphite, onyx, orchid, purple, steel, text } from './styles/colors'

const ModalWithHeader = ({
    contentLabel,
    children,
    backgroundColor,
    isOpen,
    modalHeaderStyle,
    headerContent,
    successFn,
    successText,
    cancelFn,
    cancelText,
    primaryColor,
    hoverColor,
    secondaryColor,
    modalFooterStyle,
    modalChildrenStyle,
    modalContentStyle,
    modalOverlayStyle,
    bodyOpenClassName,
    hoverStyle,
    cancelTextHoverColor,
    successButtonIsDisabled,
    buttonStyle
}) => {
    const headerStyle = {
        position: 'relative',
        width: '100%',
        backgroundColor: onyx,
        height: 50,
        display: 'flex',
        alignItems: 'center',
        paddingLeft: 20,
        ...modalHeaderStyle
    }

    const footerStyle = {
        padding: 20,
        paddingTop: 30,
        ...modalFooterStyle
    }

    const childrenStyle = {
        margin: '25px 20px 0px',
        ...modalChildrenStyle
    }

    return (

        <div id={contentLabel}>
        <Modal
            isOpen={isOpen}
            onRequestClose={cancelFn}
            contentLabel={contentLabel}
            style={{
                overlay: {
                    ...modalOverlayStyle
                },
                content: {
                    backgroundColor: backgroundColor,
                    padding: 0,
                    width: 'auto',
                    ...modalContentStyle
                }
            }}
            hoverStyle={{
                backgroundColor: graphite,
                ...hoverStyle
            }}
            bodyOpenClassName={bodyOpenClassName}
        >
            <div style={headerStyle}>
                {headerContent}
            </div>
            <div style={childrenStyle}>
                {children}
            </div>
            <div style={footerStyle}>
                <RoundedButton
                    type="primary"
                    onClick={successFn}
                    primaryColor={primaryColor}
                    hoverColor={hoverColor}
                    isDisabled={successButtonIsDisabled}
                    style={buttonStyle}
                >
                    {successText}
                </RoundedButton>
                {cancelText &&
                    <RoundedButton
                        type="cancel"
                        onClick={cancelFn}
                        primaryColor={secondaryColor}
                        hoverColor={cancelTextHoverColor}
                        style={{ cursor: 'pointer' }}
                    >
                        {cancelText}
                    </RoundedButton>}
            </div>
        </Modal>
    </div>
    )
}

ModalWithHeader.propTypes = {
    children: PropTypes.element,
    contentLabel: PropTypes.string.isRequired,
    backgroundColor: PropTypes.string.isRequired,
    modalHeaderStyle: PropTypes.object,
    successFn: PropTypes.func.isRequired,
    successText: PropTypes.string.isRequired,
    cancelFn: PropTypes.func,
    cancelText: PropTypes.string,
    primaryColor: PropTypes.string.isRequired,
    hoverColor: PropTypes.string.isRequired,
    secondaryColor: PropTypes.string.isRequired,
    modalFooterStyle: PropTypes.object,
    modalChildrenStyle: PropTypes.object,
    modalContentStyle: PropTypes.object,
    modalOverlayStyle: PropTypes.object,
    bodyOpenClassName: PropTypes.string,
    hoverStyle: PropTypes.object,
    cancelTextHoverColor: PropTypes.string,
    isOpen: PropTypes.bool.isRequired
}

ModalWithHeader.defaultProps = {
    contentLabel: '',
    backgroundColor: graphite,
    successFn: () => console.log('modalSuccessFn prop is required'),
    successText: '',
    primaryColor: purple,
    hoverColor: orchid,
    secondaryColor: 'white',
    cancelTextHoverColor: 'white',
    isOpen: false
}

export default ModalWithHeader