import React, { Component } from 'react'
import ReactDOM from 'react-dom'

import RoundedButton from './RoundedButton'
import Label from './forms/Label'
import NewButton from './NewButton'
import Popover from './Popover'
import TextField from './forms/TextField'

class NewPopover extends Component {

    render() {
        const { type, primaryColor, name, isOpen, isLoading, onRequestOpen, onRequestClose, setName, onSubmit } = this.props

        const style = {
            textField: {
                marginBottom: 20
            }
        }

        const isValid = Boolean(name)

        return (
            <Popover isOpen={isOpen} targetAttachment="bottom left" targetOffset="5px 12px" onRequestClose={onRequestClose}>
                <NewButton primaryColor={primaryColor} onClick={onRequestOpen}>New {type}</NewButton>
                <form 
                    onSubmit={
                        (e) => {
                            e.preventDefault()
                            onSubmit()
                        }
                }>
                    <Label>Name</Label>

                    <TextField 
                        ref={ref => this.textField = ref}
                        value={name} 
                        style={style.textField} 
                        onChange={e => setName(e.target.value)}
                    />

                    <RoundedButton 
                        type={'primary'} 
                        primaryColor={primaryColor} 
                        isDisabled={!isValid} 
                        isLoading={isLoading} 
                        onClick={onSubmit}
                    >
                        Create {type}
                    </RoundedButton>

                    <RoundedButton 
                        type="cancel" 
                        primaryColor={primaryColor} 
                        isDisabled={isLoading} 
                        onClick={onRequestClose}
                    >
                        Cancel
                    </RoundedButton>
                </form>
            </Popover>
        )
    }

    componentDidUpdate(prevProps) {
        if (this.props.isOpen && !prevProps.isOpen) {
            const input = ReactDOM.findDOMNode(this.textField)
            input.focus()
        }
    }
}

NewPopover.defaultProps = {
    type: 'Object',
    primaryColor: 'tomato',
    name: ''
}

export default NewPopover
