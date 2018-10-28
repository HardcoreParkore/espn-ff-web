import React, { Component } from 'react'
import Requests from './http/requests'

class LoginButton extends Component {
  setUserToLogin = () => {
    this.props.setUserToLogin(this.props.user)
  }

  render() {
    return (
      <button onClick={this.setUserToLogin}>{this.props.user.username}</button>
    )
  }
}

class LoginComponent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      users: undefined,
      userToLogin: undefined,
      password: '',
      error: null
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  componentDidMount() {
    Requests.getTeams().then(res => {
      this.setState({ users: res.data })
    })
  }

  setUserToLogin = user => {
    this.setState({ userToLogin: user })
  }

  setLoginError = err => {
    this.setState({ error: err.message })
  }

  login = () => {
    let data = {
      username: this.state.userToLogin.username,
      password: this.state.password
    }

    Requests.loginUser(data)
      .then(res => {
        console.log('setting parent user item', res)
        this.props.setUser(res.data)
      })
      .catch(err => {
        this.setLoginError(err)
      })
  }

  RenderButtons = () => {
    let buttons = []
    this.state.users.forEach(user => {
      buttons.push(
        <LoginButton
          user={user}
          setUserToLogin={this.setUserToLogin}
          setLoginError={this.setLoginError}
        />
      )
    })
    return buttons
  }

  handleChange(event) {
    this.setState({ password: event.target.value })
  }

  handleSubmit(event) {
    event.preventDefault()
    this.login()
  }

  render() {
    // TODO - Make these html declarations functions
    let buttons = []
    let error = null
    let loginForm = null

    if (this.state.users) {
      buttons = this.RenderButtons()
    }

    if (this.state.error) {
      error = (
        <div>
          <p>Try not to mess this up, we got an error from the server:</p>
          <p>{this.state.error}</p>
        </div>
      )
    }

    if (this.state.userToLogin) {
      loginForm = (
        <form onSubmit={this.handleSubmit}>
          <label>
            Password:
            <input
              type="test"
              value={this.state.password}
              onChange={this.handleChange}
            />
          </label>
          <input type="submit" value="Login" />
        </form>
      )
    }

    return (
      <div>
        {error}
        <p>Which of these idiots you is?</p>
        {buttons}
        {loginForm}
      </div>
    )
  }
}

export default LoginComponent
