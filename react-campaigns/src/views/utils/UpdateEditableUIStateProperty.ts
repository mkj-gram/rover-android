/// <reference path="../../../typings/index.d.ts"/>

export default (
    type: UIStateType,
    editableUIState: UIStateInterface,
    key: string,
    property: string,
    value: boolean
) => {
    return {
        ...editableUIState,
        [type]: {
            ...editableUIState[type],
            [property]: {
                ...editableUIState[type][property],
                [key]: value
            }
        }
    }
}
