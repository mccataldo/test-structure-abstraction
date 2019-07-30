import React from 'react'
import {render, fireEvent} from '@testing-library/react'
import Login from '../login'

// here we have a bunch of setup functions that compose together for our test cases
// I only recommend doing this when you have a lot of tests that do the same thing.
// I'm including it here only as an example. These tests don't necessitate this
// much abstraction. Read more: https://kcd.im/aha-testing
function setup() {
  const handleSubmit = jest.fn()
  const utils = render(<Login onSubmit={handleSubmit} />)
  const user = {username: 'michelle', password: 'smith'}
  const changeUsernameInput = value =>
    fireEvent.change(utils.getByLabelText(/username/i), {target: {value}})
  const changePasswordInput = value =>
    fireEvent.change(utils.getByLabelText(/password/i), {target: {value}})
  const clickSubmit = () => fireEvent.click(utils.getByText(/submit/i))
  return {
    ...utils,
    handleSubmit,
    user,
    changeUsernameInput,
    changePasswordInput,
    clickSubmit,
  }
}

function setupSuccessCase() {
  const utils = setup()
  utils.changeUsernameInput(utils.user.username)
  utils.changePasswordInput(utils.user.password)
  utils.clickSubmit()
  return utils
}

function setupWithNoPassword() {
  const utils = setup()
  utils.changeUsernameInput(utils.user.username)
  utils.clickSubmit()
  const errorMessage = utils.getByRole('alert')
  return {...utils, errorMessage}
}

function setupWithNoUsername() {
  const utils = setup()
  utils.changePasswordInput(utils.user.password)
  utils.clickSubmit()
  const errorMessage = utils.getByRole('alert')
  return {...utils, errorMessage}
}

test('calls onSubmit with the username and password', () => {
  const {handleSubmit, user} = setupSuccessCase()
  expect(handleSubmit).toHaveBeenCalledTimes(1)
  expect(handleSubmit).toHaveBeenCalledWith(user)
})

test('shows an error message when submit is clicked and no username is provided', () => {
  const {handleSubmit, errorMessage} = setupWithNoUsername()
  expect(errorMessage).toHaveTextContent(/username is required/i)
  expect(handleSubmit).not.toHaveBeenCalled()
})

test('shows an error message when password is not provided', () => {
  const {handleSubmit, errorMessage} = setupWithNoPassword()
  expect(errorMessage).toHaveTextContent(/password is required/i)
  expect(handleSubmit).not.toHaveBeenCalled()
})
