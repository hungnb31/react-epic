// form testing
// http://localhost:3000/login

import * as React from 'react'
import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import faker from "faker"

import Login from '../../components/login'

// we create this function to generate form data
// we also allow other developer to override
// with their own username and password for special cases
function buildLoginForm(overrides) {
  const username = faker.internet.userName()
  const password = faker.internet.password()

  return {username, password, ...overrides}
}

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
  const usernameEle = screen.getByLabelText(/username/i)
  const passwordEle = screen.getByLabelText(/password/i)
  const submitEle = screen.getByRole('button', { name: /submit/i })
  // 🐨 use userEvent.type to change the username and password fields to
  //    whatever you want

  // instead of manually typing the fake username and password
  // we want to make sure if other guys reading this code
  // they can understand no matter what username and password is
  // this test should still pass

  // so we want to generate the form data for the test
  const {username, password} = buildLoginForm()
  userEvent.type(usernameEle, username)
  userEvent.type(passwordEle, password)
  //
  // 🐨 click on the button with the text "Submit"
  //
  userEvent.click(submitEle)
  // assert that submittedData is correct
  // 💰 use `toEqual` from Jest: 📜 https://jestjs.io/docs/en/expect#toequalvalue

  // we can test the args passed to the jest.fn with `toBeCalledWith`
  expect(handleSubmit).toBeCalledWith({
    username,
    password
  })

  // the handle function should be called only 1 time
  expect(handleSubmit).toBeCalledTimes(1)
})

/*
eslint
  no-unused-vars: "off",
*/
