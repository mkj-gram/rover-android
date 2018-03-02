interface StringMap<T> {
    [x: string]: T
}

type RoverSVGProps = {
    fill?: string
    style?: StringMap<string | number>
    onClick?: React.MouseEventHandler<SVGSVGElement>
}

declare module 'react-rangeslider' {
    var a: any
    export default a
}

declare module 'react-travel' {
    var a: any
    export default a
}
