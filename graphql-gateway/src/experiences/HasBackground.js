import { GraphQLInterfaceType, GraphQLNonNull } from 'graphql'

import BackgroundContentMode from './BackgroundContentMode'
import BackgroundScale from './BackgroundScale'
import Color from './Color'
import Image from './Image'

const HasBackground = SuperClass => {

	class ChildClass extends SuperClass {

		constructor(props) {
			super(props)

			const { backgroundColor,
	                backgroundContentMode,
	                backgroundImage,
	                backgroundScale } = props

	    	this.backgroundColor = backgroundColor
	        this.backgroundContentMode = backgroundContentMode || 'original'
	        this.backgroundImage = backgroundImage
	        this.backgroundScale = backgroundScale || 1
		}
	}

	return ChildClass
}

HasBackground.normalizeJSON = json => {
    if (!json) {
        return {}
    }
    
    return {
        backgroundColor: Color.fromJSON(json['background-color']),
    	backgroundContentMode: json['background-content-mode'],
    	backgroundImage: Image.fromJSON(json['background-image']),
    	backgroundScale: json['background-scale'],
    }
}

HasBackground.fields = {
    backgroundColor: { type: new GraphQLNonNull(Color.type) },
    backgroundContentMode: { type: new GraphQLNonNull(BackgroundContentMode.type) },
    backgroundImage: { type: Image.type },
    backgroundScale: { type: new GraphQLNonNull(BackgroundScale.type) },
}

HasBackground.type = new GraphQLInterfaceType({
    name: 'HasBackground',
    fields: HasBackground.fields
})

export default HasBackground
