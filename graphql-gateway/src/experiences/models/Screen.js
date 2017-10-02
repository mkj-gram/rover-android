import {
    GraphQLBoolean,
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull,
    GraphQLObjectType,
    GraphQLString
} from 'graphql'

import Background from './Background'
import BackgroundContentMode from './BackgroundContentMode'
import BackgroundScale from './BackgroundScale'
import Color from './Color'
import Image from './Image'
import Row from './Row'
import StatusBarStyle from './StatusBarStyle'
import TitleBarButtons from './TitleBarButtons'

const Screen = new GraphQLObjectType({
    name: 'Screen',
	interfaces: () => [Background],
    fields: () => ({
        autoColorStatusBar: {
            type: new GraphQLNonNull(GraphQLBoolean),
            resolve: data => data['status-bar-auto-color']
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
        experienceId: {
            type: new GraphQLNonNull(GraphQLID),
            resolve: data => data['experience-id']
        },
        hasUnpublishedChanges: {
            type: new GraphQLNonNull(GraphQLBoolean),
            resolve: data => {
                // TODO: Verify admin scope
                return data['has-unpublished-changes']
            }
        },
        id: {
            type: new GraphQLNonNull(GraphQLID),
            resolve: data => data['id']
        },
        isStretchyHeaderEnabled: {
            type: new GraphQLNonNull(GraphQLBoolean),
            resolve: data => {
				const isStretchyHeaderEnabled = data['is-stretchy-header-enabled']
				return isStretchyHeaderEnabled === undefined ? true : isStretchyHeaderEnabled
			}
        },
        name: {
            type: new GraphQLNonNull(GraphQLString),
            resolve: data => {
                // TODO: Verify admin scope
                return data['name']
            }
        },
        rows: {
            type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(Row))),
            resolve: data => data['rows']
        },
        statusBarStyle: {
            type: new GraphQLNonNull(StatusBarStyle),
            resolve: data => data['status-bar-style']
        },
        statusBarColor: {
            type: new GraphQLNonNull(Color),
            resolve: data => data['status-bar-color']
        },
        titleBarBackgroundColor: {
            type: Color,
            resolve: data => data['title-bar-background-color']
        },
        titleBarButtons: {
            type: TitleBarButtons,
            resolve: data => data['title-bar-buttons']
        },
        titleBarButtonColor: {
            type: new GraphQLNonNull(Color),
            resolve: data => data['title-bar-button-color']
        },
        titleBarText: {
            type: new GraphQLNonNull(GraphQLString),
            resolve: data => data['title']
        },
        titleBarTextColor: {
            type: new GraphQLNonNull(Color),
            resolve: data => data['title-bar-text-color']
        },
        useDefaultTitleBarStyle: {
            type: new GraphQLNonNull(GraphQLBoolean),
            resolve: data => data['use-default-title-bar-style']
        },
        views: {
            type: new GraphQLNonNull(GraphQLInt),
            resolve: data => {
                // TODO: Verify admin scope
                return data['views'] || 0
            }
        }
    })
})

export default Screen
