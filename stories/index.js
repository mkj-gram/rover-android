import React from 'react';
import { storiesOf, action, linkTo } from '@kadira/storybook';
import Button from './Button';
import Welcome from './Welcome';
import { PrimaryNavigator, ProgressBar, turquoise } from '../src'

storiesOf('Welcome', module)
  .add('to Storybook', () => (
    <Welcome showApp={linkTo('Button')}/>
  ));

storiesOf('Button', module)
  .add('with text', () => (
    <Button onClick={action('clicked')}>Hello Button</Button>
  ))
  .add('with some emoji', () => (
    <Button onClick={action('clicked')}>😀 😎 👍 💯</Button>
  ));
  
storiesOf('Navigator', module)
  .add('to Storybook', () => (
      <PrimaryNavigator/>
  ))

storiesOf('ProgressBar', module)
  .add('ProgressBar', () => (
      <ProgressBar
          color={turquoise}
          steps={[
              { isCurrent: false, isComplete: true, isFirst: true, isLast: false, title: 'First Step', path: 'first' },
              { isCurrent: true, isComplete: false, isFirst: false, isLast: false, title: 'Step 2', path: 'step2' },
              { isCurrent: false, isComplete: false, isFirst: false, isLast: false, title: 'Step 3', path: 'step3' },
              { isCurrent: false, isComplete: false, isFirst: false, isLast: false, title: 'Step 4', path: 'step4' },
              { isCurrent: false, isComplete: false, isFirst: false, isLast: true, title: 'Last Step', path: 'final' }
          ]}
          onClick={action('New Path')}
          style={{ width: 540 }}
      />
  ))
