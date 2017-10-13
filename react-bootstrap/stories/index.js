import React from 'react'
import { storiesOf, action, linkTo } from '@kadira/storybook'
import {
    PrimaryNavigator,
    ProgressBar,
    ModalWithHeader,
    graphite,
    onyx,
    RoundedButton,
    text,
    titanium,
    light,
    steel,
    silver,
    purple,
    DatePicker,
    ash,
    straw,
    TextField,
    FlashMessage
} from '../src'

import { GearIcon, TagIcon, CancelIcon } from '@rover/react-icons'

storiesOf('Navigator', module).add('to Storybook', () => <PrimaryNavigator />)

// storiesOf('ProgressBar', module)
//   .add('ProgressBar', () => (
//       <ProgressBar
//           color={turquoise}
//           steps={[
//               { isCurrent: false, isComplete: true, isFirst: true, isLast: false, title: 'First Step', path: 'first' },
//               { isCurrent: true, isComplete: false, isFirst: false, isLast: false, title: 'Step 2', path: 'step2' },
//               { isCurrent: false, isComplete: false, isFirst: false, isLast: false, title: 'Step 3', path: 'step3' },
//               { isCurrent: false, isComplete: false, isFirst: false, isLast: false, title: 'Step 4', path: 'step4' },
//               { isCurrent: false, isComplete: false, isFirst: false, isLast: true, title: 'Last Step', path: 'final' }
//           ]}
//           onClick={action('New Path')}
//           style={{ width: 540 }}
//       />
//   ))

storiesOf('ModalWithHeader', module).add('ModalWithHeader', () => {
    return (
        <ModalWithHeader
            contentLabel="Test modal"
            backgroundColor={graphite}
            isOpen={true}
            headerContent={<div>test</div>}
            successFn={() => console.log('success')}
            successText="Success"
            cancelFn={() => console.log('cancel')}
            cancelText="Cancel"
            primaryColor={purple}
        />
    )
})

storiesOf('DatePicker', module).add('Datepicker', () => {
    return (
        <DatePicker
            backgroundColor={onyx}
            primaryColor={purple}
            buttonBackgroundColor={graphite}
            buttonIconColor={titanium}
            titleColor="white"
            headlineColor={steel}
            numberColor={silver}
            weekendBackgroundColor={graphite}
        />
    )
})

storiesOf('RoundedButton', module).add('Rounded Button', () => {
    return (
        <div>
            <RoundedButton type="primary" onClick={() => null}>
                basic
            </RoundedButton>
            <RoundedButton
                type="primary"
                hoverColor="blue"
                onClick={() => null}
            >
                has hover state
            </RoundedButton>
        </div>
    )
})


storiesOf('Pill', module).add('Pill', () => {
    let height=28
    let icon = true
    let text = 'testytest'
    let backgroundColor=ash
    let tagIconColor=silver
    let textColor=titanium
    let deleteButtonBackground=null
    let deleteButtonColor=silver
    //onHighlight
    let onHighlight = false
    let onHighlightBackgroundColor=straw
    let onHighlightTagIconColor=ash
    let onHighlightTextColor=graphite
    let onHighlightDeleteButtonBackground=null
    let onHighlightDeleteButtonColor=steel
    //onHover
    let onHoverDeleteButtonBackground=steel
    let onHoverDeleteButtonColor='white'
    let id="tagDeleteButton1"
    let maxWidth=350

    const getIconFill = () => {
        return (onHighlight) ? onHighlightTagIconColor : tagIconColor
    }
    const getBackgroundColor = () => {
        return (onHighlight) ? onHighlightBackgroundColor : backgroundColor
    }

    const getTextColor = () => {
        return (onHighlight) ? onHighlightTextColor : textColor
    }

    const getDeleteButtonColor = () => {
        return (onHighlight) ? onHighlightDeleteButtonColor : deleteButtonColor
    }

    const tagIcon = () => {
        return (
            <div style={{
                marginLeft: 11,
                marginRight: 8,
                width: 12,
                height: 12
            }}>
                {icon && <TagIcon
                    fill={getIconFill()}
                    style= {{ pointerEvents: 'none' }}
                    height= "12px"
                    width= "12px"
                />}
            </div>  
        )
    }

    const getText = () => {
        return (
            <div style={{display:'inline-block', ...text, ...light, fontSize: 14, color: getTextColor(),
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            minWidth: 0,
            maxWidth: maxWidth-65 // Needs to have better way
        }}>
                {text}
            </div>
        )
    }

    const handleMouseEventPill = (e, type) => {
        if (!onHighlight) {
            if (type === 'over') {
                document.getElementById(id).style.backgroundColor = steel
            } else if (type === 'leave') {
                document.getElementById(id).style.backgroundColor = ''
            }
        }
    }

    const getDeleteButton = () => {
        return (
            <div
            id = {id}
            style={{
                height: 16,
                width: 16,
                marginLeft: 8,
                marginRight: 6,
                
                borderRadius: 23,
                display: 'flex',
                flex: 'none',
                alignItems: 'center',
                justifyContent: 'center'}}
               
            >
                <CancelIcon fill={getDeleteButtonColor()} style={{ pointerEvents: 'none' }} />
            </div>
        )
    }

    let pill = (
        
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height,
            backgroundColor: getBackgroundColor(),
            
            borderRadius: 23,
            marginRight: 8,
            marginTop: 4,
            marginBottom: 4
        }}
            onMouseOver={e => handleMouseEventPill(e, 'over')}
            onMouseLeave={e => handleMouseEventPill(e, 'leave')}
        >
           {tagIcon()}
           {getText()}
           {getDeleteButton()}
        
        </div>
    )
    
    return (
        <div>
        <div style = {{
            display: 'flex',
            alignItems: 'flex-start',
            alignContent: 'flex-start',
            flexWrap: 'wrap',
            width: 370,
            height: 130,
            boxShadow: '0 3px 20px 0 rgba(0,0,0,0.25)',
            borderRadius: 3,
            overflow: 'scroll',
        }}>
            {pill}
            {pill}
            {pill}
            {pill}
            {pill}
            <TextField
            placeholder="leroy K"
            value=''
            style={{
                width: 40,
                fontSize: 14,
                focus: { borderColor: silver },
                color: 'white',
                borderColor: silver
            }}
        />
        </div>
        
        </div>
    )
})

storiesOf('FlashMessage', module).add('Message', () => {
    return (
        <FlashMessage messageText="Updating..." />
    )
})
