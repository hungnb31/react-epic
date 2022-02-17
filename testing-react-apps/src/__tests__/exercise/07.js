// testing with context and a custom render method
// http://localhost:3000/easy-button

import * as React from 'react'
import {render, screen} from '@testing-library/react'
import {ThemeProvider} from '../../components/theme'
import EasyButton from '../../components/easy-button'

test('renders with the light styles for the light theme', () => {
  const Wrapper = ({ children }) => {
    return <ThemeProvider initialTheme="light">{children}</ThemeProvider>
  }
  // using wrapper here instead of directly wrap button with <ThemeProvider>
  // because it easier when we want to test other provider
  // so it easier to switch between providers
  render(<EasyButton>Easy</EasyButton>, { wrapper: Wrapper })
  const button = screen.getByRole('button', {name: /easy/i})
  expect(button).toHaveStyle(`
    background-color: white;
    color: black;
  `)
})

// test the dark theme
test('renders with the dark styles for the dark theme', () => {
  const Wrapper = ({ children }) => {
    return <ThemeProvider initialTheme="dark">{children}</ThemeProvider>
  }
  render(<EasyButton>Easy</EasyButton>, { wrapper: Wrapper })
  const button = screen.getByRole('button', {name: /easy/i})
  expect(button).toHaveStyle(`
    color: white;
    background-color: black;
  `)
})

/* eslint no-unused-vars:0 */
