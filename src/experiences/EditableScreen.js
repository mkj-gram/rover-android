import { GraphQLBoolean, 
		 GraphQLInt, 
		 GraphQLList, 
		 GraphQLNonNull, 
		 GraphQLObjectType, 
		 GraphQLString } from 'graphql'

import EditableRow from './EditableRow'
import Screen from './Screen'

class EditableScreen extends Screen {

	constructor(props) {        
        super(props)

        const { hasUnpublishedChanges,
                name,
                rows,
                views } = props

        this.hasUnpublishedChanges = hasUnpublishedChanges
        this.name = name
        this.rows = rows
        this.views = views
    }
}

EditableScreen.fromJSON = json => {
    const props = EditableScreen.normalizeJSON(json)
    return new EditableScreen(props)
}

EditableScreen.normalizeJSON = json => {
    if (!json) {
        return {}
    }

    return {
        ...Screen.normalizeJSON(json),
        hasUnpublishedChanges: json['has-unpublished-changes'],
        name: json['name'],
        rows: (json['rows'] || []).map(EditableRow.fromJSON),
        views: json['views'] || 0
    }
}

EditableScreen.fields = {
	...Screen.fields,
	hasUnpublishedChanges: { type: new GraphQLNonNull(GraphQLBoolean) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    rows: { type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(EditableRow.type))) },
    views: { type: new GraphQLNonNull(GraphQLInt) }
}

EditableScreen.type = new GraphQLObjectType({
    name: 'EditableScreen',
    description: 'A screen that includes fields related to authoring/editing',
    fields: EditableScreen.fields
})

export default EditableScreen
