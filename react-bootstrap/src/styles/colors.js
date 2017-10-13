/* Grays */

export const charcoal = '#323232'

export const graphite = '#5C5D5C'

export const onyx = '#434343'

export const slate = '#4c4c4c'

export const ash = '#6f6f6f'

export const steel = '#818181'

export const chalice = '#ADADAD'

export const silver = '#BCBCBC'

export const titanium = '#D8D8D8'

export const mercury = '#E9E9E9'

export const cloud = '#EEEEEE'

export const offwhite = '#F5F5F5'

/* Colors */

export const blue = '#35A7F8'

export const mint = '#59D698'

export const turquoise = '#1DD2B5'

export const straw = '#FFFEF4'

export const red = '#E06D23'

export const pink = '#FF00C8'

export const orange = '#FFAB6F'

export const purple = '#8357D6'

export const violet = '#A270ff'

export const lavender = '#D8C4ff'

export const orchid = '#AE83FF'

export const rgba = ({ red, green, blue, alpha }) => {
    return `rgba(${red}, ${green}, ${blue}, ${alpha})`
}

export const hexa = ({ hex = '000000', alpha = 0.5 }) => {
    if (hex.indexOf('#') === 0) {
        hex = hex.slice(1)
    }

    const bigint = parseInt(hex, 16)
    return rgba({
        red: (bigint >> 16) & 255,
        green: (bigint >> 8) & 255,
        blue: bigint & 255,
        alpha
    })
}
