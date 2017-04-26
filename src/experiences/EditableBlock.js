import { GraphQLInt, 
		 GraphQLInterfaceType, 
		 GraphQLNonNull, 
		 GraphQLString } from 'graphql'

import Block from './Block'
import LockStatus from './LockStatus'

class EditableBlock extends Block { }

EditableBlock.normalizeJSON = json => {
	if (!json) {
        return {}
    }
    
    return {
    	...Block.normalizeJSON(json),
    	clickCount: json['click-count'] || 0,
	    lockStatus: json['lock-status'] || 'unlocked',
	    name: json['name']
    }
}

EditableBlock.fields = {
	...Block.fields,
	clickCount: { type: new GraphQLNonNull(GraphQLInt) },
    lockStatus: { type: new GraphQLNonNull(LockStatus.type) },
    name: { type: new GraphQLNonNull(GraphQLString) }
}

EditableBlock.type = new GraphQLInterfaceType({
    name: 'EditableBlock',
    fields: EditableBlock.fields
})

export default EditableBlock
