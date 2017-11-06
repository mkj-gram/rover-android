import React from 'react'
import PropTypes from 'prop-types'

import { silver, steel, titanium, TypeAhead } from '@rover/react-bootstrap'

const StringInputTypeAhead = ({ stringValue, successFn, updateValue, data }) => (
    <div style={{ display: 'relative', marginLeft: 5 }}>
        <TypeAhead
            textFieldStyle={{
                backgroundColor: 'transparent',
                border: 'none',
                borderBottom: `1px solid ${steel}`,
                borderColor: steel,
                textDecoration: 'none',
                outline: 'none',
                color: titanium,
                fontFamily: 'Source Sans Pro',
                fontSize: 16,
                textAlign: 'left',
                paddingBottom: 3,
                paddingLeft: 5,
                display: 'initial',
                width: 200,
                lineHeight: 1.2,
                focus: {
                    borderBottom: '1px solid',
                    borderColor: silver
                },
                input: {
                    borderBottom: '1px solid',
                    borderColor: silver,
                    padding: '3px 0 3px 10px'
                }
            }}
            items={(data && data.suggestions.filter(s => s !== '')) || []}
            update={updateValue}
            value={stringValue}
            onKeyDown={e => e.keyCode === 13 && e.target.value.length > 0 && successFn()}
        />
    </div>
)

StringInputTypeAhead.propTypes = {
    data: PropTypes.shape({
        suggestions: PropTypes.arrayOf(PropTypes.string)
    }),
    stringValue: PropTypes.string.isRequired,
    successFn: PropTypes.func.isRequired,
    updateValue: PropTypes.func.isRequired
}

StringInputTypeAhead.defaultProps = {
    data: {
        stringSuggestion: []
    }
}

export default StringInputTypeAhead
