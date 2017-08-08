import { GraphQLInterfaceType, GraphQLNonNull, GraphQLString } from 'graphql'

import Image from './Image'

const HasImage = SuperClass => {

    class ChildClass extends SuperClass {

        constructor(props) {
            super(props)
            this.image = props.image
        }
    }

    return ChildClass
}

HasImage.normalizeJSON = json => {
    if (!json) {
        return {}
    }
    
    return {
        image: Image.fromJSON(json['image'])
    }
}

HasImage.fields = {
    image: { type: Image.type }
}

HasImage.type = new GraphQLInterfaceType({
    name: 'HasImage',
    fields: HasImage.fields
})

export default HasImage
