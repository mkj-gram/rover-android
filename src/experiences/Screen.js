import { GraphQLBoolean, 
         GraphQLID, 
         GraphQLList, 
         GraphQLNonNull, 
         GraphQLObjectType, 
         GraphQLString } from 'graphql'

import Color from './Color'
import HasBackground from './HasBackground'
import Row from './Row'
import StatusBarStyle from './StatusBarStyle'
import TitleBarButtons from './TitleBarButtons'

class Screen extends HasBackground(null) {

	constructor(props) {
        super(props)

        const { autoColorStatusBar,
                experienceId,
                id,
                rows,
                statusBarStyle,
                statusBarColor,
                titleBarBackgroundColor,
                titleBarButtons,
                titleBarButtonColor,
                titleBarText,
                titleBarTextColor,
                useDefaultTitleBarStyle } = props

		this.autoColorStatusBar = autoColorStatusBar
        this.experienceId = experienceId
        this.id = id
        this.rows = rows
        this.statusBarStyle = statusBarStyle
        this.statusBarColor = statusBarColor
        this.titleBarBackgroundColor = titleBarBackgroundColor
        this.titleBarButtons = titleBarButtons
        this.titleBarButtonColor = titleBarButtonColor
        this.titleBarText = titleBarText
        this.titleBarTextColor = titleBarTextColor
        this.useDefaultTitleBarStyle = useDefaultTitleBarStyle
	}
}

Screen.fromJSON = json => {
    const props = Screen.normalizeJSON(json)
    return new Screen(props)
}

Screen.normalizeJSON = json => {
    if (!json) {
        return {}
    }

    return {
        ...HasBackground.normalizeJSON(json),
        autoColorStatusBar: Color.fromJSON(json['status-bar-auto-color']),
        experienceId: json['experience-id'],
        id: json['id'],
        rows: (json['rows'] || []).map(Row.fromJSON),
        statusBarStyle: json['status-bar-style'],
        statusBarColor: Color.fromJSON(json['status-bar-color']),
        titleBarBackgroundColor: Color.fromJSON(json['title-bar-background-color']),
        titleBarButtons: json['title-bar-buttons'],
        titleBarButtonColor: Color.fromJSON(json['title-bar-button-color']),
        titleBarText: json['title-bar-text'],
        titleBarTextColor: Color.fromJSON(json['title-bar-text-color']),
        useDefaultTitleBarStyle: json['use-default-title-bar-style']
    }
}

Screen.fields = {
    ...HasBackground.fields,
    autoColorStatusBar: { type: new GraphQLNonNull(GraphQLBoolean) },
    experienceId: { type: new GraphQLNonNull(GraphQLID) },
    id: { type: new GraphQLNonNull(GraphQLID) },
    rows: { type: new GraphQLNonNull(new GraphQLList(Row.type)) },
    statusBarStyle: { type: new GraphQLNonNull(StatusBarStyle.type) },
    statusBarColor: { type: new GraphQLNonNull(Color.type) },
    titleBarBackgroundColor: { type: Color.type },
    titleBarButtons: { type: TitleBarButtons.type },
    titleBarButtonColor: { type: new GraphQLNonNull(Color.type) },
    titleBarText: { type: GraphQLString },
    titleBarTextColor: { type: Color.type },
    useDefaultTitleBarStyle: { type: new GraphQLNonNull(GraphQLBoolean) }
}

Screen.type = new GraphQLObjectType({
    name: 'Screen',
    description: 'A screen that contains only the publicly accessible fields',
    interfaces: [HasBackground.type],
    fields: Screen.fields,
    isTypeOf: data => data instanceof Screen
})

export default Screen
