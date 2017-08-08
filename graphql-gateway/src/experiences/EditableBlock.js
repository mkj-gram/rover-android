import { GraphQLInt, 
		 GraphQLInterfaceType, 
		 GraphQLNonNull, 
		 GraphQLString } from 'graphql'

import LockStatus from './LockStatus'

const EditableBlock = SuperClass => {

	class ChildClass extends SuperClass {

		constructor(props) {
			super(props)

			const { clickCount = 0,
		    		lockStatus = 'unlocked',
		    		name } = props

		    this.clickCount = clickCount

		    // TODO: The server shouldn't be sending null for lock status
			this.lockStatus = lockStatus || 'unlocked'
			
			this.name = name
		}
	}

	return ChildClass
}

EditableBlock.normalizeJSON = json => {
    if (!json) {
        return {}
    }
    
    return {
        clickCount: json['click-count'],
	    lockStatus: json['lock-status'],
	    name: json['name']
    }
}

EditableBlock.fields = {
	clickCount: { type: new GraphQLNonNull(GraphQLInt) },
    lockStatus: { type: new GraphQLNonNull(LockStatus.type) },
    name: { type: new GraphQLNonNull(GraphQLString) }
}

EditableBlock.type = new GraphQLInterfaceType({
    name: 'EditableBlock',
    fields: EditableBlock.fields
})

export default EditableBlock
