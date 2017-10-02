import {
    GraphQLBoolean,
    GraphQLID,
    GraphQLList,
    GraphQLNonNull,
    GraphQLObjectType,
    GraphQLString
} from 'graphql'

import Background from './Background'
import BackgroundContentMode from './BackgroundContentMode'
import BackgroundScale from './BackgroundScale'
import Block from './Block'
import Color from './Color'
import Image from './Image'
import Length from './Length'

const Row = new GraphQLObjectType({
    name: 'Row',
    interfaces: () => [Background],
    fields: () => ({
		autoHeight: {
			type: new GraphQLNonNull(GraphQLBoolean),
			resolve: data => data['auto-height']
		},
		backgroundColor: {
			type: new GraphQLNonNull(Color),
			resolve: data => data['background-color']
		},
	    backgroundContentMode: {
			type: new GraphQLNonNull(BackgroundContentMode),
			resolve: data => data['background-content-mode'] || 'original'
		},
	    backgroundImage: {
			type: Image,
			resolve: data => data['background-image']
		},
	    backgroundScale: {
			type: new GraphQLNonNull(BackgroundScale),
			resolve: data => data['background-scale'] || 1
		},
	    blocks: {
			type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(Block))),
			resolve: data => data['blocks']
		},
	    experienceId: {
			type: new GraphQLNonNull(GraphQLID),
			resolve: data => data['experience-id']
		},
	    height: {
			type: new GraphQLNonNull(Length),
			resolve: data => data['height']
		},
	    id: {
			type: new GraphQLNonNull(GraphQLID),
			resolve: data => data['id']
		},
        isCollapsed: {
            type: new GraphQLNonNull(GraphQLBoolean),
            resolve: data => {
                // TODO: Verify admin scope
                return data['is-collapsed']
            }
        },
        name: {
            type: new GraphQLNonNull(GraphQLString),
            resolve: data => {
                // TODO: Verify admin scope
                return data['name']
            }
        },
	    screenId: {
			type: new GraphQLNonNull(GraphQLID),
			resolve: data => data['screen-id']
		}
	})
})

export default Row
