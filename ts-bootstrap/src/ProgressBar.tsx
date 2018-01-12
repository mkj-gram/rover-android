/// <reference path="../typings/index.d.ts"/>
import * as React from 'react'

type ProgressBarProps = {
    progress: number
    barStyle?: StringMap<string | number>
    progressStyle?: StringMap<string | number>
}

export default ({ barStyle, progress, progressStyle }: ProgressBarProps) => {
    const style = {
        backgroundColor: 'tomato',
        width: 0,
        height: 8,
        ...progressStyle
    }
    return <div>{`Progress ${progress}%`}</div>
}
