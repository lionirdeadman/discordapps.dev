import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

class AuthenticateLogout extends Component {
  render() {
    if (typeof fetch !== 'undefined') {
      fetch('https://ls.terminal.ink/auth/logout', {
        credentials: 'include'
      })
    }
    return (<Redirect to="/" />)
  }
}

export default AuthenticateLogout;