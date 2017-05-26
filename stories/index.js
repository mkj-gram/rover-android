import React from 'react'
import { storiesOf, action, linkTo } from '@kadira/storybook'
import { PrimaryNavigator, ProgressBar, ModalWithHeader, graphite, onyx, RoundedButton, text, titanium, light, steel, silver, purple, DatePicker } from '../src'
import { GearIcon } from '@rover/react-icons'

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
        >
            
        </ModalWithHeader>
    )
})

storiesOf('DatePicker', module).add('Datepicker', () => {
    return (
        <DatePicker
            backgroundColor={onyx}
            primaryColor={purple}
            buttonBackgroundColor={graphite}
            buttonIconColor={titanium}
            titleColor='white'
            headlineColor={steel}
            numberColor={silver}
            weekendBackgroundColor={graphite}
        />
    )
})

storiesOf('RoundedButton', module).add('Rounded Button', () => {
    return (
        <div>
            <RoundedButton
             type='primary'
             onClick={() => null}
            >
              basic
            </RoundedButton>
            <RoundedButton
             type='primary'
             hoverColor='blue'
             onClick={() => null}
            >
              has hover state
            </RoundedButton>
        </div>
    )
})