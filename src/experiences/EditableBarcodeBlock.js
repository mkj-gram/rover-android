import EditableBlockMixin from './EditableBlockMixin'
import BarcodeBlock from './BarcodeBlock'

class EditableBarcodeBlock extends EditableBlockMixin(BarcodeBlock) { }

EditableBarcodeBlock.fromJSON = json => {
	const props = EditableBarcodeBlock.normalizeJSON(json)
	return new EditableBarcodeBlock(props)
}

export default EditableBarcodeBlock
