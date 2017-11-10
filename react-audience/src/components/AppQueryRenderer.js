import React from 'react'
import { QueryRenderer, graphql } from 'react-relay'
import environment from '../relay/Environment'

import Audience from './Audience'
import Skeleton from './Skeleton'

const AppQueryRendererQuery = graphql`
    query AppQueryRendererQuery {
        ...SideBarRefetchContainer
        ...AudienceTableRefetchContainer
    }
`

const AppQueryRenderer = () => (
    <QueryRenderer
        environment={environment}
        query={AppQueryRendererQuery}
        render={({ error, props = {} }) => {
            if (error) {
                console.log(error)
                return <div>error</div>
            }
            if (props) {
                return <Audience data={props} />
            }
            return <Skeleton />
        }}
    />
)

export default AppQueryRenderer
