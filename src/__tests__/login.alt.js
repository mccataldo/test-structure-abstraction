import React from 'react'
import {render, fireEvent} from '@testing-library/react'
import Login from '../login'
// user is data that might need to be dynamic or changed frequently (like testing in different environments/configurations)
// so I usually keep it out of spec files
import data from '../testData'
// renamed some things that made more sense to me
function setupPage() {
  const handleSubmit = jest.fn()
  // maybe `dom` is also not appropriate but `utils` seemed confusing
  const dom = render(<Login onSubmit={handleSubmit} />)
  // some overkill abstractions, but that's OK because it was fun :)
  const fillField = label => value =>
    fireEvent.change(dom.getByLabelText(label), {target: {value}})
  const clickButton = button => () => fireEvent.click(dom.getByText(button))
  const inputUsername = fillField(/username/i)
  const inputPassword = fillField(/password/i)
  const clickSubmit = clickButton(/submit/i)
  // it felt right to put this here instead
  const errorMessage = () => dom.getByRole('alert')
  return {
    ...dom,
    handleSubmit,
    inputUsername,
    inputPassword,
    clickSubmit,
    errorMessage,
  }
}

// in the name of avoiding side effects (i.e. mutable variable via `let page`),
// `const page = setupPage()` was not pulled into a `beforeEach()`
// but we're still avoiding declarations beyond the first line to keep it clean
// and putting the `page` method calls inside `test()` maintains the typical do-this-then-expect-that style
test('calls onSubmit with the username and password', () => {
  const page = setupPage()
  page.inputUsername(data.user.username)
  page.inputPassword(data.user.password)
  page.clickSubmit()
  expect(page.handleSubmit).toHaveBeenCalledTimes(1)
  expect(page.handleSubmit).toHaveBeenCalledWith(data.user)
})

test('shows an error message when submit is clicked and no username is provided', () => {
  const page = setupPage()
  page.inputPassword(data.user.password)
  page.clickSubmit()
  expect(page.errorMessage()).toHaveTextContent(/username is required/i)
  expect(page.handleSubmit).not.toHaveBeenCalled()
})

test('shows an error message when password is not provided', () => {
  const page = setupPage()
  page.inputUsername(data.user.username)
  page.clickSubmit()
  expect(page.errorMessage()).toHaveTextContent(/password is required/i)
  expect(page.handleSubmit).not.toHaveBeenCalled()
})
