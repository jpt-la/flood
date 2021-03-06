import React, { Component } from 'react'
import PropTypes from 'prop-types'


/** Form for entering user info and updating current subscriptions */
class LoginForm extends Component {
  static propTypes = {
    userLogin: PropTypes.func
  }

  constructor(props) {
    super(props)
    this.state = {
      username: '',
      password: '',
      min: 0,
      max: 50,
      pattern: '',
      label: '',
      error: '',
      type: '',
      labelPWD: ''
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSearch = this.handleSearch.bind(this)
  }


  /**
   * Watches for changes on the html inputs
   * @param {object} event - event fired when the SEARCH button is clicked
   */
  handleChange(event) {
    const name = event.target.name
    const value = event.target.value
    let nextState = {}
    if (name === 'username' && value === '') {
      nextState = { ...nextState,
        min: 0,
        max: 50,
        pattern: '',
        label: '',
        error: '',
        type: ''
      }

    }
    else if (name === 'username' && value != '' && !isNaN(value.charAt(0))) {
      nextState = { ...nextState,
        min: 10,
        max: 10,
        pattern: '[0-9]*',
        label: 'Phone Number',
        error: '10 digits only including US area code',
        type: 'phone'
      }
    }
    else if (name === 'username' && value != '') {
      nextState = { ...nextState,
        min: 0,
        max: 50,
        pattern: '[A-Za-z0-9]*',
        label: 'Username',
        error: '',
        type: 'username'
      }
    }
    nextState[name] = value
    this.setState(nextState)

    if (name === 'password' && value != '') {
      this.setState({labelPWD: 'Password'})
    }
    else if (name === 'password' && value === '') {
      this.setState({labelPWD: ''})
    }
  }


  /**
   * Sets the user info in the store and searches for the user's subscriptions
   * @param {object} event - event fired when the SEARCH button is clicked
   */
  handleSearch(event) {
    event.preventDefault()
    if (this.state.type === 'username') {
      this.props.userLogin(this.state.username, this.state.password)
    }
    else if (this.state.type === 'phone') {
      const formattedPhone = `+1${this.state.username}`
      this.props.userLogin(formattedPhone, this.state.password)
    }
  }


  render() {
    return (
        <form className="login-form" onSubmit={ this.handleSearch }>
            <p>Sign in to subscribe to flood gages and manage your current gage subscriptions.</p>
            <label className="form-chunk">{this.state.label}
              <input
                       pattern={this.state.pattern}
                       minLength={this.state.min}
                       maxLength={this.state.max}
                       error={this.state.error}
                       type="username"
                       id="username"
                       name="username"
                       placeholder="Username or Phone Number"
                       onChange={this.handleChange}
                       value={this.state.username}/>
            </label>
            <label className="form-chunk">{this.state.labelPWD}
              <input
                       type="password"
                       id="password"
                       name="password"
                       placeholder="Password"
                       onChange={this.handleChange}
                       value={this.state.password}/>
            </label>
            <div className="login-button-wrapper">
              <button
                className="button flood-form-button"
                type="submit"
                value="Submit">
                sign in
              </button>
            </div>
        </form>
    )
  }
}

export default LoginForm
