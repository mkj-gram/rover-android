import { GraphQLBoolean, 
         GraphQLInt, 
         GraphQLList, 
         GraphQLNonNull, 
         GraphQLObjectType, 
         GraphQLString } from 'graphql'

import EditableScreen from './EditableScreen'
import Experience from './Experience'

class EditableExperience extends Experience {

    constructor(props) {        
        super(props)

        const { hasUnpublishedChanges,
                isArchived,
                isPublished,
                name,
                screens,
                simulatorUrl,
                viewToken,
                versionId,
                recentAverageDuration } = props

        this.hasUnpublishedChanges = hasUnpublishedChanges
        this.isArchived = isArchived
        this.isPublished = isPublished
        this.name = name
        this.screens = screens
        this.simulatorUrl = simulatorUrl
        this.viewToken = viewToken
        this.versionId = versionId
        this.recentAverageDuration = recentAverageDuration
    }
}

EditableExperience.fromJSON = json => {
    const props = EditableExperience.normalizeJSON(json)
    return new EditableExperience(props)
}

EditableExperience.normalizeJSON = json => {
    if (!json) {
        return {}
    }

    return {
        ...Experience.normalizeJSON(json),
        hasUnpublishedChanges: json['has-unpublished-changes'],
        isArchived: json['is-archived'],
        isPublished: json['is-published'],
        name: json['name'],
        screens: (json['screens'] || []).map(EditableScreen.fromJSON),
        simulatorUrl: json['simulator-url'],
        viewToken: json['view-token'],
        versionId: json['version-id'],
        recentAverageDuration: json['recent-average-duraction']
    }
}

EditableExperience.fields = {
    ...Experience.fields,
    hasUnpublishedChanges: { type: new GraphQLNonNull(GraphQLBoolean) },
    isArchived: { type: new GraphQLNonNull(GraphQLBoolean) },
    isPublished: { type: new GraphQLNonNull(GraphQLBoolean) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    screens: { type: new GraphQLNonNull(new GraphQLList(EditableScreen.type)) },
    simulatorUrl: { type: new GraphQLNonNull(GraphQLString) },
    viewToken: { type: new GraphQLNonNull(GraphQLString) },
    versionId: { type: GraphQLString },
    recentAverageDuration: { type: GraphQLInt }
}

EditableExperience.type = new GraphQLObjectType({
    name: 'EditableExperience',
    description: 'An experience that includes fields related to authoring/editing',
    fields: EditableExperience.fields
})

export default EditableExperience
