import React from 'react'
import { QueryRenderer, graphql } from 'react-relay'
import environment from '../relay/Environment'

import Audience from './Audience'

const AppQueryRendererQuery = graphql`
    query AppQueryRendererQuery {
        ...SideBar
        ...AudienceTable
    }
`

const AppQueryRenderer = () =>
    (<QueryRenderer
        environment={environment}
        query={AppQueryRendererQuery}
        render={({ error, props = {} }) => {
            if (error) {
                console.log(error)
                return <div>error</div>
            }
            if (props) {
                return (
                    <Audience data={props} />
                )
            }
            return <div>Loading</div>
        }}
    />)

export default AppQueryRenderer
