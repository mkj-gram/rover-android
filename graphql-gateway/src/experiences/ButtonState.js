import { GraphQLObjectType } from 'graphql'

import HasBackground from './HasBackground'
import HasBorder from './HasBorder'
import HasText from './HasText'

class ButtonState extends HasText(HasBorder(HasBackground(null))) { }

ButtonState.fromJSON = json => {
	const props = ButtonState.normalizeJSON(json)
	return new ButtonState(props)
}

ButtonState.normalizeJSON = json => {
	if (!json) {
		return {}
	}

	return {
		...HasBackground.normalizeJSON(json),
		...HasBorder.normalizeJSON(json),
		...HasText.normalizeJSON(json)
	}
}

ButtonState.fields = {
	...HasBackground.fields,
	...HasBorder.fields,
	...HasText.fields
}

ButtonState.type = new GraphQLObjectType({
    name: 'ButtonState',
    interfaces: [HasBackground.type, HasBorder.type, HasText.type],
    fields: ButtonState.fields,
    isTypeOf: data => data instanceof ButtonState
})

export default ButtonState
