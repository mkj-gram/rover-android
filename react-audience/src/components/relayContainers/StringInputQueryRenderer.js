import React from 'react'
import PropTypes from 'prop-types'
import { graphql, QueryRenderer } from 'react-relay'
import environment from '../../relay/Environment'
import StringInputTypeAhead from '../sidebar/StringInputTypeAhead'

const StringInputQueryRenderer = ({ attribute, selector, stringComparison, stringValue, successFn, updateValue }) => {
    const StringInputQueryRendererQuery = graphql`
        query StringInputQueryRendererQuery($field: String!, $selector: String!, $size: Int!) {
                suggestions: stringSuggestion(
                    field: $field
                    selector: $selector
                    size: $size
                )
        }
    `
    return (
        <QueryRenderer
            environment={environment}
            query={StringInputQueryRendererQuery}
            variables={{
                field: attribute,
                selector,
                size: 100
            }}
            render={({ error, props = {} }) => {
                if (!error) {
                    return (
                        <StringInputTypeAhead
                            data={props}
                            attribute={attribute}
                            key={stringComparison}
                            selector={selector}
                            stringValue={stringValue}
                            successFn={successFn}
                            updateValue={updateValue}
                        />
                    )
                }
                return <div>Error</div>
            }}
        />
    )
}

StringInputQueryRenderer.propTypes = {
    attribute: PropTypes.string.isRequired,
    selector: PropTypes.string.isRequired,
    stringComparison: PropTypes.stringComparison.isRequired,
    stringValue: PropTypes.stringValue.isRequired,
    successFn: PropTypes.func.isRequired,
    updateValue: PropTypes.func.isRequired
}

export default StringInputQueryRenderer
