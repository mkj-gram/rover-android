import { GraphQLInterfaceType, GraphQLNonNull } from 'graphql'

import ButtonState from './ButtonState'
import Color from './Color'

const HasButtonStates = SuperClass => {

    class ChildClass extends SuperClass {

        constructor(props) {
            super(props)

            const { disabled,
                    highlighted,
                    normal,
                    selected } = props

            highlighted.textColor = new Color({
                red: highlighted.textColor.red,
                green: highlighted.textColor.green,
                blue: highlighted.textColor.blue,
                alpha: highlighted.textColor.alpha * 0.5
            })

            this.disabled = disabled
            this.highlighted = highlighted
            this.normal = normal
            this.selected = selected
        }
    }

    return ChildClass
}

HasButtonStates.normalizeJSON = json => {
    if (!json) {
        return {}
    }
    
    let states = json['states']

    if (!states) {
        return {}
    }

    const disabled = {
        'background-content-mode': json['background-content-mode'],
        'background-image': json['background-image'],
        'background-scale': json['background-scale'],
        ...states['disabled']
    }

    const highlighted = {
        'background-content-mode': json['background-content-mode'],
        'background-image': json['background-image'],
        'background-scale': json['background-scale'],
        ...states['highlighted']
    }

    const normal = {
        'background-content-mode': json['background-content-mode'],
        'background-image': json['background-image'],
        'background-scale': json['background-scale'],
        ...states['normal']
    }

    const selected = {
        'background-content-mode': json['background-content-mode'],
        'background-image': json['background-image'],
        'background-scale': json['background-scale'],
        ...states['selected']
    }

    return {
        disabled: ButtonState.fromJSON(disabled),
        highlighted: ButtonState.fromJSON(highlighted),
        normal: ButtonState.fromJSON(normal),
        selected: ButtonState.fromJSON(selected)
    }
}

HasButtonStates.fields = {
    disabled: { type: new GraphQLNonNull(ButtonState.type) },
    highlighted: { type: new GraphQLNonNull(ButtonState.type) },
    normal: { type: new GraphQLNonNull(ButtonState.type) },
    selected: { type: new GraphQLNonNull(ButtonState.type) }
}

HasButtonStates.type = new GraphQLInterfaceType({
    name: 'HasButtonStates',
    fields: HasButtonStates.fields
})

export default HasButtonStates
