import * as React from 'react'
import Button from './Button'
import Text from './Text'
import { steel, titanium, turquoise, aquamarine } from '../styles/colors'
import PlusIcon from './Icons/PlusIcon'
import CircleCloseIcon from './Icons/CircleCloseIcon'

export interface PopoverFormInputProps {
    deleteText: () => void
    id: string
    isEditingText: boolean
    label: string
    media: 'Mobile' | 'Tablet' | 'Desktop'

    startEditingText: () => void
    text?: string
    updateText: (text: string) => void
    fieldStyle?: React.CSSProperties
    primaryTextSize?: 'h1' | 'h2' | 'large' | 'medium' | 'small'

    addButton?: JSX.Element | React.ReactPortal
    editButton?: JSX.Element | React.ReactPortal
    textMode?: Boolean
}

const getFieldStyle: () => React.CSSProperties = () => ({
    minHeight: 71,
    width: '100%',
    marginTop: 24,
    display: 'block'
})

const renderTextControlButtons = (
    deleteText: () => void,
    media: 'Mobile' | 'Tablet' | 'Desktop',
    startEditingText: () => void,
    text?: string,
    editButton?: JSX.Element | React.ReactPortal
) => {
    switch (media) {
        case 'Desktop':
            return (
                <div>
                    {text && (
                        <Button
                            onClick={deleteText}
                            text="Remove"
                            type="regular"
                            style={{
                                innerStyle: {
                                    fontSize: 15,
                                    marginRight: 8
                                }
                            }}
                            mouseDownColors={{
                                active: turquoise,
                                inactive: aquamarine
                            }}
                        />
                    )}
                    <Button
                        onClick={startEditingText}
                        text="Edit"
                        type="regular"
                        style={{
                            innerStyle: {
                                fontSize: 15
                            }
                        }}
                        mouseDownColors={{
                            active: turquoise,
                            inactive: aquamarine
                        }}
                    />
                </div>
            )

        case 'Tablet':
        case 'Mobile':
        default:
            const Fragment = React.Fragment
            return (
                <Fragment>
                    <CircleCloseIcon
                        fill={turquoise}
                        onClick={e => {
                            e.stopPropagation()
                            deleteText()
                        }}
                        style={{
                            marginRight: media === 'Tablet' ? 16 : 0
                        }}
                    />

                    {editButton}
                </Fragment>
            )
    }
}

const PopoverFormInput: React.SFC<PopoverFormInputProps> = ({
    deleteText,
    id,
    isEditingText,
    label,
    media,

    startEditingText,
    text,
    updateText,
    fieldStyle,
    primaryTextSize = 'large',

    addButton,
    editButton,
    textMode
}) => {
    const containerFieldStyle: React.CSSProperties = {
        ...getFieldStyle(),
        ...fieldStyle
    }

    if (!text && !isEditingText) {
        return (
            <div
                style={{
                    ...containerFieldStyle,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}
                onClick={() => startEditingText()}
            >
                <Text
                    text={label}
                    label={true}
                    size={primaryTextSize}
                    textStyle={{ color: steel }}
                />
                {addButton}
            </div>
        )
    }
    return (
        <div
            style={{
                ...containerFieldStyle,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}
            onClick={(e: any) => {
                if (!isEditingText) {
                    startEditingText()
                }
            }}
        >
            <div
                style={{
                    flex: '1 1 0',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                }}
            >
                <Text
                    text={label}
                    label={true}
                    size="small"
                    textStyle={{ display: 'block', color: steel }}
                />

                <Text
                    text={text}
                    id={id}
                    contentEditable={isEditingText}
                    handleChange={(str: string) => {
                        updateText(str)
                    }}
                    size={primaryTextSize}
                    onBlurChange={isEditingText}
                    textStyle={{
                        width: '100%'
                    }}
                />
            </div>
            {!isEditingText &&
                (textMode
                    ? renderTextControlButtons(
                          deleteText,
                          media,
                          startEditingText,
                          text,
                          editButton
                      )
                    : editButton)}
        </div>
    )
}
export default PopoverFormInput
