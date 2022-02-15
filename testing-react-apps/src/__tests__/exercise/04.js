// form testing
// http://localhost:3000/login

import * as React from 'react'
import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Login from '../../components/login'

test('submitting the form calls onSubmit with username and password', () => {
  // 🐨 create a variable called "submittedData" and a handleSubmit function that
  // accepts the data and assigns submittedData to the data that was submitted
  // 💰 if you need a hand, here's what the handleSubmit function should do:
  // const handleSubmit = data => (submittedData = data)
  const handleSubmit = jest.fn()
  //
  // 🐨 render the login with your handleSubmit function as the onSubmit prop
  //
  render(<Login onSubmit={handleSubmit} />)
  // 🐨 get the username and password fields via `getByLabelText`
  const username = screen.getByLabelText(/username/i)
  const password = screen.getByLabelText(/password/i)
  const submit = screen.getByRole('button', { name: /submit/i })
  // 🐨 use userEvent.type to change the username and password fields to
  //    whatever you want
  userEvent.type(username, "username")
  userEvent.type(password, "password")
  //
  // 🐨 click on the button with the text "Submit"
  //
  userEvent.click(submit)
  // assert that submittedData is correct
  // 💰 use `toEqual` from Jest: 📜 https://jestjs.io/docs/en/expect#toequalvalue

  // we can test the args passed to the jest.fn with `toBeCalledWith`
  expect(handleSubmit).toBeCalledWith({
    username: "username",
    password: "password"
  })

  // the handle function should be called only 1 time
  expect(handleSubmit).toBeCalledTimes(1)
})

/*
eslint
  no-unused-vars: "off",
*/
