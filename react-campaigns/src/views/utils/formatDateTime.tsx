export const formatDisplayTime = (time: number) => {
    const minutes = Math.floor(time / 60) % 60
    const hours = Math.floor(time / 3600) % 3600
    const period = time - 12 * 3600 < 0 ? 'AM' : 'PM'

    return `${hours === 0 || hours === 12 ? 12 : hours % 12}:${
        minutes.toString().length === 1 ? `0${minutes}` : minutes
    } ${period}`
}

export const formatDate = (date: string) => {
    if (date == null) {
        return null
    }
    const year = date.substr(0, 4)
    const month = date.substr(5, 2)
    const day = date.substr(8, 2)

    return new Date(`${month}/${day}/${year}`)
}
