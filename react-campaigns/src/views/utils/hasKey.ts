const hasKey = <O>(obj: O, key: string): key is keyof O => key in obj

export default hasKey
