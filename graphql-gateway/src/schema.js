import { GraphQLSchema } from 'graphql'
import Mutation from './root/Mutation'
import Query from './root/Query'

import {
    BooleanPredicate,
    DatePredicate,
    GeofencePredicate,
    NumberPredicate,
    StringArrayPredicate,
    StringPredicate,
    VersionPredicate,
} from './segments/Predicate'

import BarcodeBlock from './experiences/models/BarcodeBlock'
import ButtonBlock from './experiences/models/ButtonBlock'
import ImageBlock from './experiences/models/ImageBlock'
import RectangleBlock from './experiences/models/RectangleBlock'

const schema = new GraphQLSchema({
    query: Query.type,
    mutation: Mutation.type,
    types: [
        BarcodeBlock,
        BooleanPredicate,
        ButtonBlock,
        DatePredicate,
        ImageBlock,
        GeofencePredicate,
        NumberPredicate,
        RectangleBlock,
        StringPredicate,
        StringArrayPredicate,
        VersionPredicate
    ]
})

export default schema
