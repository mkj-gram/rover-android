import moment from 'moment'

const getRelativeTime = (value) => moment(value).fromNow()

export default getRelativeTime
