export default enumType =>
    Object.keys(enumType).reduce((map, k) => {
        const v = enumType[k]
        map[v] = k
        return map
    }, {})
