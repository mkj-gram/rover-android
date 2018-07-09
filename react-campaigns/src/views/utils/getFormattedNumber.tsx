export default (num: number): string => {
    let total: string | number = num
    if (num >= 1000 && num < 1000000) {
        total = `${Math.floor((num / 1000) * Math.pow(10, 1)) /
            Math.pow(10, 1)}K`
    } else if (num >= 1000000) {
        total = `${Math.floor((num / 1000000) * Math.pow(10, 1)) /
            Math.pow(10, 1)}M`
    }
    return total.toString()
}
