import EditableBlockMixin from './EditableBlockMixin'
import TextBlock from './TextBlock'

class EditableTextBlock extends EditableBlockMixin(TextBlock) { }

EditableTextBlock.fromJSON = json => {
	const props = EditableTextBlock.normalizeJSON(json)
	return new EditableTextBlock(props)
}

export default EditableTextBlock
