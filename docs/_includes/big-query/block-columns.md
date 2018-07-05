| Column | Description |
| :--- | :--- |
| block.id | The block's ID. |
| block.name | The block's name. |
| block.type | The type of block – one of: "barcode-block", "button-block", "image-block", "rectangle-block", "text-block" or "webview-block". |
| block.position | The numeric position the block appears in its row, from top-to-bottom, starting at 1. |
| block.action.type | The type of action that should be taken when the block is tapped. The value in this column will be either "go-to-screen", "open-url" or null if there is no action assigned to the block. |
| block.action.url | If the block action type is "open-url", the value in this column will be the URL that should be opened when tapped. |
| block.action.screen_id | If the block action type is "go-to-screen", the value in this column will be the ID of the screen that should be navigated to. |
