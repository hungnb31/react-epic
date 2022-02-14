// Avoid implementation details
// http://localhost:3000/counter

import * as React from 'react'
// 🐨 add `screen` to the import here:
import {render, screen} from '@testing-library/react'
import userEvent from "@testing-library/user-event"
import Counter from '../../components/counter'

test('counter increments and decrements when the buttons are clicked', () => {
  const {container} = render(<Counter />)
  // 🐨 replace these with screen queries
  // 💰 you can use `getByText` for each of these (`getByRole` can work for the button too)
  // if we add another button to the component
  // so the first button would not to be the decrement button
  // and the second also not increment button
  // const [decrement, increment] = container.querySelectorAll('button')

  // we have this way to directly query to the increment and decrement button
  const increment = screen.getByText("Increment");
  const decrement = screen.getByText("Decrement");

  // OR
  // const increment = screen.getByRole('button', { name: /increment/i})
  // const decrement = screen.getByRole('button', { name: /decrement/i})
  const message = container.firstChild.querySelector('div')

  expect(message).toHaveTextContent('Current count: 0')
  // what if user not just click the button but they could use mouseup or mousedown
  // to trigger event
  // so our test would fail because we just test the click event
  // so we need to use userEvent instead of fireEvent because
  // userEvent should test every "click" event that user can have

  // with this change, even if we change the action in component from 
  // onClick to onMouseDown or onMouseUp, the test still pass
  userEvent.click(increment)
  expect(message).toHaveTextContent('Current count: 1')
  userEvent.click(decrement)
  expect(message).toHaveTextContent('Current count: 0')
})
