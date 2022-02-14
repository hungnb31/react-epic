// Avoid implementation details
// http://localhost:3000/counter

import * as React from 'react'
// 🐨 add `screen` to the import here:
import {render, fireEvent, screen} from '@testing-library/react'
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
  fireEvent.click(increment)
  expect(message).toHaveTextContent('Current count: 1')
  fireEvent.click(decrement)
  expect(message).toHaveTextContent('Current count: 0')
})
