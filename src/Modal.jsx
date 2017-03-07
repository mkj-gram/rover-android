import React from 'react'
import Modal from 'react-modal'

import IconButton from './IconButton'

export default ({ 
    isOpen, 
    onAfterOpen,
    onRequestClose,
    closeTimeoutMS,
    style = {},
    children
}) => {

    style = {
        overlay : {
            backgroundColor: 'transparent',
            ...style.overlay
        },
        content: {
            background: 'white',
            border: 'none',
            borderRadius: 5,
            bottom: 'auto',
            boxShadow: '0px 3px 20px 0px rgba(0, 0, 0, 0.25)',
            left: '50%',
            padding: '40px 20px 20px 20px',
            right: 'auto',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            ...style.content
        }
    }

    return (
        <Modal
            isOpen={isOpen}
            onAfterOpen={onAfterOpen} onRequestClose={onRequestClose} closeTimeoutMS={closeTimeoutMS}
            contentLabel="Rover Platform"
            style={style}>
            <IconButton 
                type={'close'} 
                onClick={onRequestClose} 
                style={{
                    position: 'absolute',
                    top: 10,
                    right: 10,
                    zIndex: 1
                }}
            />
            {children}
        </Modal>
    )
}
