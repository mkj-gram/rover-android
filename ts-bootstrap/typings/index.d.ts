interface StringMap<T> {
    [x: string]: T
}

interface NumberMap<T> {
    [x: number]: T
}

type RoverSVGProps = {
    fill?: string
    height?: string
    style?: StringMap<string | number>
    onClick?: React.MouseEventHandler<SVGSVGElement>
    width?: string
    viewBox?: string
}

declare module 'react-rangeslider' {
    var a: any
    export default a
}

declare module 'react-travel' {
    var a: any
    export default a
}

interface InjectedProps {
    device?: string
}
