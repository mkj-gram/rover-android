/* eslint-disable */
import React, { Component } from 'react'
import SideBar from './sidebar/SideBar'
import AudienceTable from './table/AudienceTable'

export default class Skeleton extends Component {
  render() {
    return (
      <div style={{ display: 'flex', flex: '1 1 100%' }}>
        <SideBar />
        <AudienceTable skeleton />
      </div>
    )
  }
}
