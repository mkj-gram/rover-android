import EditableBlockMixin from './EditableBlockMixin'
import WebViewBlock from './WebViewBlock'

class EditableWebViewBlock extends EditableBlockMixin(WebViewBlock) { }

EditableWebViewBlock.fromJSON = json => {
	const props = EditableWebViewBlock.normalizeJSON(json)
	return new EditableWebViewBlock(props)
}

export default EditableWebViewBlock
