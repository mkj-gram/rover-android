import { GraphQLObjectType } from 'graphql'

import Block from './Block'
import EditableBlock from './EditableBlock'

const EditableBlockMixin = SuperClass => {

	class ChildClass extends SuperClass {

		constructor(props) {
			super(props)

			const { clickCount,
		    		lockStatus,
		    		name } = props

		    this.clickCount = clickCount
			this.lockStatus = lockStatus
			this.name = name
		}
	}

	ChildClass.normalizeJSON = json => {
	    if (!json) {
	        return {}
	    }
	    
	    return {
	    	...SuperClass.normalizeJSON(json),
	        ...EditableBlock.normalizeJSON(json)
	    }
	}

	ChildClass.fields = {
		...SuperClass.fields,
	    ...EditableBlock.fields
	}

	ChildClass.type = new GraphQLObjectType({
	    name: 'Editable' + ChildClass.type.name,
	    interfaces: [Block.type, EditableBlock.type],
	    fields: ChildClass.fields,
	    isTypeOf: data => data instanceof ChildClass
	})

	return ChildClass
}

export default EditableBlockMixin
