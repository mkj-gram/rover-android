interface StringMap<T> {
    [x: string]: T
}

type RoverSVGProps = {
    fill?: string
    style?: StringMap<string | number>
}
