import EditableBlockMixin from './EditableBlockMixin'
import RectangleBlock from './RectangleBlock'

class EditableRectangleBlock extends EditableBlockMixin(RectangleBlock) { }

EditableRectangleBlock.fromJSON = json => {
	const props = EditableRectangleBlock.normalizeJSON(json)
	return new EditableRectangleBlock(props)
}

export default EditableRectangleBlock
