import { GraphQLSchema } from 'graphql'

import BarcodeBlock from './experiences/BarcodeBlock'
import EditableBarcodeBlock from './experiences/EditableBarcodeBlock'
import EditableImageBlock from './experiences/EditableImageBlock'
import EditableRectangleBlock from './experiences/EditableRectangleBlock'
import EditableTextBlock from './experiences/EditableTextBlock'
import EditableWebViewBlock from './experiences/EditableWebViewBlock'
import ImageBlock from './experiences/ImageBlock'
import Mutation from './root/Mutation'
import Query from './root/Query'
import RectangleBlock from './experiences/RectangleBlock'
import TextBlock from './experiences/TextBlock'
import WebViewBlock from './experiences/WebViewBlock'

const schema = new GraphQLSchema({
    query: Query.type,
    mutation: Mutation.type,
    types: [BarcodeBlock.type,
    		EditableBarcodeBlock.type,
    		EditableImageBlock.type,
    		EditableRectangleBlock.type,
    		EditableTextBlock.type,
    		EditableWebViewBlock.type,
    		ImageBlock.type,
    		TextBlock.type,
    		WebViewBlock.type,
    		RectangleBlock.type]
})

export default schema
