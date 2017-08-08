import { GraphQLID, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql'
import Screen from './Screen'

class Experience {

	constructor({ id, homeScreenId, screens }) {
		this.id = id
        this.homeScreenId = homeScreenId
        this.screens = screens
	}
}

Experience.fromJSON = json => {
    const props = Experience.normalizeJSON(json)
    return new Experience(props)
}

Experience.normalizeJSON = json => {
	if (!json) {
        return {}
    }

    return {
        id: json['id'],
        homeScreenId: json['home-screen-id'],
        screens: (json['screens'] || []).map(Screen.fromJSON)
    }
}

Experience.fields = {
    id: { type: new GraphQLNonNull(GraphQLID) },
    homeScreenId: { type: new GraphQLNonNull(GraphQLString) },
    screens: { type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(Screen.type))) }
}

Experience.type = new GraphQLObjectType({
    name: 'Experience',
    description: 'An experience that contains only the publicly accessible fields',
    fields: Experience.fields
})

export default Experience
