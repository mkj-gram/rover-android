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
    FloatPredicate
} from './segments/Predicate'

import BarcodeBlock from './experiences/models/BarcodeBlock'
import ButtonBlock from './experiences/models/ButtonBlock'
import ImageBlock from './experiences/models/ImageBlock'
import RectangleBlock from './experiences/models/RectangleBlock'
import TextBlock from './experiences/models/TextBlock'
import WebViewBlock from './experiences/models/WebViewBlock'

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
        TextBlock,
        VersionPredicate,
        WebViewBlock,
        FloatPredicate
    ]
})

export default schema
