// mocking HTTP requests
// http://localhost:3000/login-submission

import * as React from 'react'
// 🐨 you'll need to grab waitForElementToBeRemoved from '@testing-library/react'
import {render, screen, waitForElementToBeRemoved} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {build, fake} from '@jackfranklin/test-data-bot'
// 🐨 you'll need to import rest from 'msw' and setupServer from msw/node
import {setupServer} from 'msw/node'
import {handlers} from 'test/server-handlers'
import Login from '../../components/login-submission'
import { rest } from 'msw'

const buildLoginForm = build({
  fields: {
    username: fake(f => f.internet.userName()),
    password: fake(f => f.internet.password()),
  },
})

// we can reuse the handlers from exported file
// so we can have that handlers to make server running
// and we can access that server from browser
const server = setupServer(...handlers)

beforeAll(() => server.listen())
afterAll(() => server.close())
// we need to reset the server handlers to return back to the default handler
// because we just modify the server handlers in some test
// so to make sure it will not affect to other tests
// we need to reset the handlers for each test
afterEach(() => server.resetHandlers())

// 🐨 get the server setup with an async function to handle the login POST request:
// 💰 here's something to get you started
// rest.post(
//   'https://auth-provider.example.com/api/login',
//   async (req, res, ctx) => {},
// )
// you'll want to respond with an JSON object that has the username.
// 📜 https://mswjs.io/

// 🐨 before all the tests, start the server with `server.listen()`
// 🐨 after all the tests, stop the server with `server.close()`

test(`logging in displays the user's username`, async () => {
  render(<Login />)
  const {username, password} = buildLoginForm()

  userEvent.type(screen.getByLabelText(/username/i), username)
  userEvent.type(screen.getByLabelText(/password/i), password)
  // 🐨 uncomment this and you'll start making the request!
  userEvent.click(screen.getByRole('button', {name: /submit/i}))

  // as soon as the user hits submit, we render a spinner to the screen. That
  // spinner has an aria-label of "loading" for accessibility purposes, so
  // 🐨 wait for the loading spinner to be removed using waitForElementToBeRemoved
  // 📜 https://testing-library.com/docs/dom-testing-library/api-async#waitforelementtoberemoved

  await waitForElementToBeRemoved(() => screen.getByLabelText(/loading/i))
  // once the login is successful, then the loading spinner disappears and
  // we render the username.
  // 🐨 assert that the username is on the screen
  expect(screen.getByText(username)).toBeInTheDocument()
})

test('omitting the password result in an error', async () => {
  render(<Login />)
  const {username} = buildLoginForm()

  userEvent.type(screen.getByLabelText(/username/i), username)

  // not going to fill in the password
  userEvent.click(screen.getByRole('button', {name: /submit/i}))

  // wait for loading
  await waitForElementToBeRemoved(() => screen.getByLabelText(/loading/i))

  // the "password required" is autofilled by snapshot
  // we do this to avoid message change in the future
  // if the message change, what we need to do is only press "u" in test terminal
  // so the snapshot will also update
  expect(screen.getByRole('alert').textContent).toMatchInlineSnapshot(
    `"password required"`,
  )
})

test('unknown server error display the error message', async () => {
  const errorMessage = "something bad happened!"
  server.use(
    rest.post(
      "https://auth-provider.example.com/api/login",
      async(req, res, ctx) => {
        return res(ctx.status(500), ctx.json({ message: errorMessage }))
      }
    )
  )
  render(<Login />)

  userEvent.click(screen.getByRole('button', { name: /submit/i }))

  await waitForElementToBeRemoved(() => screen.getByLabelText(/loading/i))

  expect(screen.getByRole('alert')).toHaveTextContent(errorMessage)
})