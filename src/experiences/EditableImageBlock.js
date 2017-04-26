import EditableBlockMixin from './EditableBlockMixin'
import ImageBlock from './ImageBlock'

class EditableImageBlock extends EditableBlockMixin(ImageBlock) { }

EditableImageBlock.fromJSON = json => {
	const props = EditableImageBlock.normalizeJSON(json)
	return new EditableImageBlock(props)
}

export default EditableImageBlock
