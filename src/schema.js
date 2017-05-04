import { GraphQLSchema } from 'graphql'

import BarcodeBlock from './experiences/BarcodeBlock'
import ButtonBlock from './experiences/ButtonBlock'
import ButtonState from './experiences/ButtonState'
import EditableBarcodeBlock from './experiences/EditableBarcodeBlock'
import EditableButtonBlock from './experiences/EditableButtonBlock'
import EditableImageBlock from './experiences/EditableImageBlock'
import EditableRectangleBlock from './experiences/EditableRectangleBlock'
import EditableTextBlock from './experiences/EditableTextBlock'
import EditableWebViewBlock from './experiences/EditableWebViewBlock'
import GoToScreenAction from './experiences/GoToScreenAction'
import ImageBlock from './experiences/ImageBlock'
import Mutation from './root/Mutation'
import OpenUrlAction from './experiences/OpenUrlAction'
import Query from './root/Query'
import RectangleBlock from './experiences/RectangleBlock'
import TextBlock from './experiences/TextBlock'
import WebViewBlock from './experiences/WebViewBlock'

const schema = new GraphQLSchema({
    query: Query.type,
    mutation: Mutation.type,
    types: [BarcodeBlock.type,
            ButtonBlock.type,
            ButtonState.type,
            EditableButtonBlock.type,
    		EditableBarcodeBlock.type,
    		EditableImageBlock.type,
    		EditableRectangleBlock.type,
    		EditableTextBlock.type,
    		EditableWebViewBlock.type,
            GoToScreenAction.type,
    		ImageBlock.type,
            OpenUrlAction.type,
            RectangleBlock.type,
    		TextBlock.type,
    		WebViewBlock.type]
})

export default schema
