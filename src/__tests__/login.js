import React from 'react'
import {render, fireEvent} from '@testing-library/react'
import Login from '../login'

test('calls onSubmit with the username and password when submit is clicked', () => {
  const handleSubmit = jest.fn()
  const {getByLabelText, getByText} = render(<Login onSubmit={handleSubmit} />)
  const user = {username: 'michelle', password: 'smith'}

  fireEvent.change(getByLabelText(/username/i), {
    target: {value: user.username},
  })
  fireEvent.change(getByLabelText(/password/i), {
    target: {value: user.password},
  })
  fireEvent.click(getByText(/submit/i))

  expect(handleSubmit).toHaveBeenCalledTimes(1)
  expect(handleSubmit).toHaveBeenCalledWith(user)
})

test('shows an error message when submit is clicked and no username is provided', () => {
  const handleSubmit = jest.fn()
  const {getByLabelText, getByText, getByRole} = render(
    <Login onSubmit={handleSubmit} />,
  )

  fireEvent.change(getByLabelText(/password/i), {target: {value: 'anything'}})
  fireEvent.click(getByText(/submit/i))

  const errorMessage = getByRole('alert')
  expect(errorMessage).toHaveTextContent(/username is required/i)
  expect(handleSubmit).not.toHaveBeenCalled()
})

test('shows an error message when submit is clicked and no password is provided', () => {
  const handleSubmit = jest.fn()
  const {getByLabelText, getByText, getByRole} = render(
    <Login onSubmit={handleSubmit} />,
  )

  fireEvent.change(getByLabelText(/username/i), {target: {value: 'anything'}})
  fireEvent.click(getByText(/submit/i))

  const errorMessage = getByRole('alert')
  expect(errorMessage).toHaveTextContent(/password is required/i)
  expect(handleSubmit).not.toHaveBeenCalled()
})
