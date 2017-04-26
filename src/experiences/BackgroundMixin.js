import { GraphQLNonNull } from 'graphql'

import BackgroundContentMode from './BackgroundContentMode'
import BackgroundScale from './BackgroundScale'
import Color from './Color'
import Image from './Image'

const BackgroundMixin = SuperClass => {

	class ChildClass extends SuperClass {

		constructor(props) {
			super(props)

			const { backgroundColor,
	                backgroundContentMode,
	                backgroundImage,
	                backgroundScale } = props

	    	this.backgroundColor = backgroundColor
	        this.backgroundContentMode = backgroundContentMode
	        this.backgroundImage = backgroundImage
	        this.backgroundScale = backgroundScale
		}
	}

	ChildClass.normalizeJSON = json => {
	    if (!json) {
	        return {}
	    }
	    
	    return {
	    	...SuperClass.normalizeJSON(json),
	        backgroundColor: Color.fromJSON(json['background-color']),
        	backgroundContentMode: json['background-content-mode'],
        	backgroundImage: Image.fromJSON(json['background-image']),
        	backgroundScale: json['background-scale'],
	    }
	}

	ChildClass.fields = {
		...SuperClass.fields,
	    backgroundColor: { type: new GraphQLNonNull(Color.type) },
	    backgroundContentMode: { type: BackgroundContentMode.type },
	    backgroundImage: { type: Image.type },
	    backgroundScale: { type: BackgroundScale.type },
	}

	return ChildClass
}

export default BackgroundMixin
