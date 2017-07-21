import React from 'react'
import { QueryRenderer, graphql } from 'react-relay'
import environment from '../relay/Environment'

import AudienceTable from './table/AudienceTable'
import SideBar from './sidebar/SideBar'

const AppQueryRendererQuery = graphql`
    query AppQueryRendererQuery {
        ...SideBar
    }
`

const AppQueryRenderer = () =>
    (<QueryRenderer
        environment={environment}
        query={AppQueryRendererQuery}
        render={({ error, props }) =>
            error
                ? <div>Error</div>
                : <div style={{ display: 'flex', flex: '1 1 100%' }}>
                     {props && <SideBar data={props} />}
                      <AudienceTable />
                  </div>}
    />)

export default AppQueryRenderer
