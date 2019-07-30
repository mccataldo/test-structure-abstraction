import React from 'react'
import {render, fireEvent} from '@testing-library/react'
import Login from '../login'

describe('Login', () => {
  let utils,
    handleSubmit,
    user,
    changeUsernameInput,
    changePasswordInput,
    clickSubmit

  beforeEach(() => {
    handleSubmit = jest.fn()
    utils = render(<Login onSubmit={handleSubmit} />)
    user = {username: 'michelle', password: 'smith'}
    changeUsernameInput = value =>
      fireEvent.change(utils.getByLabelText(/username/i), {target: {value}})
    changePasswordInput = value =>
      fireEvent.change(utils.getByLabelText(/password/i), {target: {value}})
    clickSubmit = () => fireEvent.click(utils.getByText(/submit/i))
  })

  describe('when username and password is provided', () => {
    beforeEach(() => {
      changeUsernameInput(user.username)
      changePasswordInput(user.password)
    })

    describe('when the submit button is clicked', () => {
      beforeEach(() => {
        clickSubmit()
      })

      it('should call onSubmit with the username and password', () => {
        expect(handleSubmit).toHaveBeenCalledTimes(1)
        expect(handleSubmit).toHaveBeenCalledWith(user)
      })
    })
  })

  describe('when the password is not provided', () => {
    beforeEach(() => {
      changeUsernameInput(user.username)
    })

    describe('when the submit button is clicked', () => {
      let errorMessage
      beforeEach(() => {
        clickSubmit()
        errorMessage = utils.getByRole('alert')
      })

      it('should show an error message', () => {
        expect(errorMessage).toHaveTextContent(/password is required/i)
      })
    })
  })

  describe('when the username is not provided', () => {
    beforeEach(() => {
      changePasswordInput(user.password)
    })

    describe('when the submit button is clicked', () => {
      let errorMessage
      beforeEach(() => {
        clickSubmit()
        errorMessage = utils.getByRole('alert')
      })

      it('should show an error message', () => {
        expect(errorMessage).toHaveTextContent(/username is required/i)
      })
    })
  })
})
