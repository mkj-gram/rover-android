import { GraphQLBoolean, 
         GraphQLID, 
         GraphQLList, 
         GraphQLNonNull, 
         GraphQLObjectType, 
         GraphQLString } from 'graphql'

import BackgroundContentMode from './BackgroundContentMode'
import BackgroundScale from './BackgroundScale'
import Color from './Color'
import Image from './Image'
import Row from './Row'
import StatusBarStyle from './StatusBarStyle'
import TitleBarButtons from './TitleBarButtons'

class Screen {

	constructor({ autoColorStatusBar, 
				  backgroundColor, 
				  backgroundImage, 
				  backgroundContentMode,
				  backgroundScale,
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
				  useDefaultTitleBarStyle }) {

		this.autoColorStatusBar = autoColorStatusBar
		this.backgroundColor = backgroundColor
    	this.backgroundImage = backgroundImage
        this.backgroundContentMode = backgroundContentMode
        this.backgroundScale = backgroundScale
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
        autoColorStatusBar: Color.fromJSON(json['status-bar-auto-color']),
        backgroundColor: Color.fromJSON(json['background-color']),
        backgroundImage: Image.fromJSON(json['background-image']),
        backgroundContentMode: json['background-content-mode'],
        backgroundScale: json['background-scale'],
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
    autoColorStatusBar: { type: new GraphQLNonNull(GraphQLBoolean) },
    backgroundColor: { type: new GraphQLNonNull(Color.type) },
    backgroundImage: { type: Image.type },
    backgroundContentMode: { type: BackgroundContentMode.type },
    backgroundScale: { type: BackgroundScale.type },
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
    fields: Screen.fields
})

export default Screen
