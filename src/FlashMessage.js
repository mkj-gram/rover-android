import React, { PropTypes } from 'react'
import { text, semibold } from './styles/typography'
import { graphite, lavender, mauve } from './styles/colors'

const FlashMessage = ({
    messageText,
    borderColor,
    backgroundColor,
    padding,
    style
}) => {
    const { left, right, top, bottom } = padding
    const flashMessageStyle = {
        ...semibold,
        ...text,
        backgroundColor: backgroundColor,
        border: `2px solid ${borderColor}`,
        borderRadius: 3,
        paddingBottom: bottom,
        paddingLeft: left,
        paddingRight: right,
        paddingTop: top,
        ...style
    }

    return <div style={flashMessageStyle}>{messageText}</div> 
}

FlashMessage.propTypes = {
    messageText: PropTypes.string.isRequired,
    borderColor: PropTypes.string,
    backgroundColor: PropTypes.string,
    padding: PropTypes.shape({
        left: PropTypes.number,
        right: PropTypes.number,
        top: PropTypes.number,
        bottom: PropTypes.number
    }),
    position: PropTypes.string,
    style: PropTypes.object
}

FlashMessage.defaultProps = {
    messageText: '',
    backgroundColor: '#F4EEFF',
    borderColor: '#DDCBFE',
    padding: {
        left: 30,
        right: 30,
        top: 7,
        bottom: 8
    },
    style: {}
}

export default FlashMessage
