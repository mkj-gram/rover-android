import { GraphQLInterfaceType, GraphQLNonNull } from 'graphql'

import ButtonState from './ButtonState'

const HasButtonStates = SuperClass => {

    class ChildClass extends SuperClass {

        constructor(props) {
            super(props)

            const { disabled,
                    highlighted,
                    normal,
                    selected } = props

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

    return {
        disabled: ButtonState.fromJSON(states['disabled']),
        highlighted: ButtonState.fromJSON(states['highlighted']),
        normal: ButtonState.fromJSON(states['normal']),
        selected: ButtonState.fromJSON(states['selected'])
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
