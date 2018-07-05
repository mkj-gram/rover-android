import { GraphQLSchema } from 'graphql'

import Mutation from './Mutation'
import Query from './Query'

import {
    AutomatedNotificationCampaign,
    ScheduledNotificationCampaign
} from './Campaign'

import { Node, PageInfo } from './Connection'

import {
    BarcodeBlock,
    ButtonBlock,
    GoToScreenBlockTapBehavior,
    ImageBlock,
    NoneBlockTapBehavior,
    OpenURLBlockTapBehavior,
    PresentWebsiteBlockTapBehavior,
    RectangleBlock,
    TextBlock,
    WebViewBlock
} from './Experience'

import {
    OpenAppNotificationTapBehavior,
    OpenURLNotificationTapBehavior,
    PresentWebsiteNotificationTapBehavior
} from './Notification'

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
        GoToScreenBlockTapBehavior,
        ImageBlock,
        NoneBlockTapBehavior,
        Node,
        NumberPredicate,
        OpenAppNotificationTapBehavior,
        OpenURLBlockTapBehavior,
        OpenURLNotificationTapBehavior,
        PresentWebsiteBlockTapBehavior,
        PresentWebsiteNotificationTapBehavior,
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
