import { steel } from './colors'

export const text = {
    color: steel,
    cursor: 'default',
    fontFamily: '"Source Sans Pro", sans-serif',
    fontSize: 14,
    lineHeight: '1.2'
}

export const link  = {
    outline: 'none',
    textDecoration: 'none'
}

export const unselectable = {
    WebkitTouchCallout: 'none',
    WebkitUserSelect: 'none',
    MozUserSelect: 'none',
    MsUserSelect: 'none',
    UserSelect: 'none'
}

/* Sizes */

export const large = {
    fontSize: 16
}

/* Weights */

export const light = {
    fontWeight: '300'
}

export const regular = {
    fontWeight: '400'
}

export const semibold = { 
    fontWeight: '600'
}

export const bold = { 
    fontWeight: '700'
}

/* Utilities */

export const uppercase = {
    textTransform: 'uppercase'
}

export const truncate = {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
}
