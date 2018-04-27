import * as React from 'react'
import Button from './Button'
import Text from './Text'
import { steel, titanium, turquoise } from '../styles/colors'
import PlusIcon from './Icons/PlusIcon'
import CircleCloseIcon from './Icons/CircleCloseIcon'

export interface TextInputProps {
    children?: JSX.Element
    deleteText: () => void
    fieldStyle?: React.CSSProperties
    handleBlurChange?: (text?: string) => void
    id: string
    isEditingText: boolean
    isRequired?: boolean
    label: string
    media: 'Mobile' | 'Tablet' | 'Desktop'
    placeholder?: string
    primaryTextSize?: 'h1' | 'h2' | 'large' | 'medium' | 'small'
    startEditingText: () => void
    text: string | undefined
    updateText: (text: string) => void
}

const getFieldStyle: () => React.CSSProperties = () => ({
    width: '100%',
    display: 'block',
    padding: '24px 0 23px',
    borderBottom: `1px solid ${titanium}`
})

const renderAddButton = (
    media: 'Mobile' | 'Tablet' | 'Desktop',
    startEditingText: () => void
) => {
    switch (media) {
        case 'Desktop':
            return (
                <Button
                    onClick={startEditingText}
                    text="Add"
                    type="regular"
                    style={{
                        innerStyle: {
                            fontSize: 15,
                            color: turquoise
                        },
                        outerStyle: {
                            height: null,
                            lineHeight: '24px'
                        }
                    }}
                />
            )
        case 'Tablet':
            return <PlusIcon fill={titanium} onClick={startEditingText} />
        case 'Mobile':
        default:
            return
    }
}
const renderTextControlButtons = (
    deleteText: () => void,
    media: 'Mobile' | 'Tablet' | 'Desktop',
    startEditingText: () => void,
    text: string | undefined
) => {
    switch (media) {
        case 'Desktop':
            return (
                <React.Fragment>
                    {text && (
                        <Button
                            onClick={deleteText}
                            text="Remove"
                            type="regular"
                            style={{
                                innerStyle: {
                                    fontSize: 15,
                                    marginRight: 8,
                                    color: turquoise
                                },
                                outerStyle: {
                                    height: null,
                                    lineHeight: '24px'
                                }
                            }}
                        />
                    )}
                    <Button
                        onClick={startEditingText}
                        text="Edit"
                        type="regular"
                        style={{
                            innerStyle: {
                                fontSize: 15,
                                color: turquoise
                            },
                            outerStyle: {
                                height: null,
                                lineHeight: '24px'
                            }
                        }}
                    />
                </React.Fragment>
            )
        case 'Tablet':
        case 'Mobile':
        default:
            return (
                <CircleCloseIcon
                    fill={turquoise}
                    onClick={e => {
                        e.stopPropagation()
                        deleteText()
                    }}
                />
            )
    }
}

const TextInput: React.SFC<TextInputProps> = ({
    children,
    deleteText,
    handleBlurChange,
    id,
    isEditingText,
    label,
    media,
    placeholder,
    startEditingText,
    text,
    updateText,
    fieldStyle,
    primaryTextSize = 'large',
    isRequired = false
}) => {
    const containerFieldStyle: React.CSSProperties = {
        ...getFieldStyle(),
        ...fieldStyle
    }

    if (placeholder && isRequired) {
        return (
            <div style={containerFieldStyle} onClick={startEditingText}>
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
                    handleBlurChange={handleBlurChange}
                    handleChange={(str: string) => updateText(str)}
                    size={primaryTextSize}
                    onBlurChange={true}
                    placeholder={true}
                    placeholderText={placeholder}
                    textStyle={{ width: '100%' }}
                />
                {children}
            </div>
        )
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
                onClick={() => {
                    if (media === 'Mobile' || media === 'Tablet') {
                        startEditingText()
                    }
                }}
            >
                <Text
                    text={label}
                    label={true}
                    size={primaryTextSize}
                    textStyle={{ color: steel }}
                />
                {renderAddButton(media, startEditingText)}
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
                if (
                    (media === 'Mobile' || media === 'Tablet') &&
                    !isEditingText
                ) {
                    startEditingText()
                }
            }}
        >
            <div
                style={{
                    flex: '1 1 0'
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
                    handleBlurChange={handleBlurChange}
                    handleChange={(str: string) => {
                        updateText(str)
                    }}
                    size={primaryTextSize}
                    onBlurChange={isEditingText}
                    textStyle={{
                        width: '100%'
                    }}
                />
                {children}
            </div>
            {!isEditingText &&
                renderTextControlButtons(
                    deleteText,
                    media,
                    startEditingText,
                    text
                )}
        </div>
    )
}
export default TextInput
