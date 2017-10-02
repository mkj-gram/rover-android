import { GraphQLInterfaceType, GraphQLNonNull } from 'graphql'
import BackgroundContentMode from './BackgroundContentMode'
import BackgroundScale from './BackgroundScale'
import ButtonState from './ButtonState'
import Color from './Color'
import Image from './Image'
import RectangleBlock from './RectangleBlock'
import Row from './Row'
import Screen from './Screen'

const Background = new GraphQLInterfaceType({
    name: 'Background',
    fields: () => ({
		backgroundColor: {
			type: new GraphQLNonNull(Color)
		},
	    backgroundContentMode: {
			type: new GraphQLNonNull(BackgroundContentMode)
		},
	    backgroundImage: {
			type: Image
		},
	    backgroundScale: {
			type: new GraphQLNonNull(BackgroundScale)
		}
	}),
    resolveType: data => {
        if (data['experience-id'] && data['screen-id'] && data['row-id']) {
            return RectangleBlock
        }

        if (data['experience-id'] && data['screen-id']) {
            return Row
        }

        if (data['experience-id']) {
            return Screen
        }

        return ButtonState
    }
})

export default Background
