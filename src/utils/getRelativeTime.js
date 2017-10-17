const getRelativeTime = (value) => {
    const now = new Date()
    const secondsPast = (now.getTime() - new Date(value).getTime()) / 1000

    if (secondsPast <= 86400) {
        return `${parseInt(secondsPast / 3600)} hours ago`
    }

    if (secondsPast <= 604800) {
        return `${parseInt(secondsPast / 86400)} days ago`
    }

    if (secondsPast <= 2628000) {
        return `${parseInt(secondsPast / 604800)} weeks ago`
    }

    if (secondsPast <= 31536000) {
        return `${parseInt(secondsPast / 2628000)} months ago`
    }

    if (secondsPast > 31536000) {
        return `${parseInt(secondsPast / 31536000)} years ago`
    }
}

export default getRelativeTime
