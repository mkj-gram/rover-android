import { GraphQLSchema } from 'graphql'

import Mutation from './Mutation'
import Query from './Query'

import {
    AutomatedNotificationCampaign,
    ScheduledNotificationCampaign
} from './Campaign'

import {
    BarcodeBlock,
    ButtonBlock,
    ImageBlock,
    RectangleBlock,
    TextBlock,
    WebViewBlock
} from './Experience'

import {
    BooleanPredicate,
    DatePredicate,
    FloatPredicate,
    GeofencePredicate,
    NumberPredicate,
    StringArrayPredicate,
    StringPredicate,
    VersionPredicate
} from './Predicate'

const schema = new GraphQLSchema({
    query: Query,
    mutation: Mutation,
    types: [
        AutomatedNotificationCampaign,
        BarcodeBlock,
        BooleanPredicate,
        ButtonBlock,
        DatePredicate,
        FloatPredicate,
        GeofencePredicate,
        ImageBlock,
        NumberPredicate,
        RectangleBlock,
        ScheduledNotificationCampaign,
        StringArrayPredicate,
        StringPredicate,
        TextBlock,
        VersionPredicate,
        WebViewBlock
    ]
})

export default schema
