import React, { MouseEvent, ReactElement, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { Status, User } from './General/User/User'

function App() {
  const [message, setMessage] = React.useState<ReactElement>()

  const click = (e: MouseEvent) => {
    const user = {
      UserID: 1,
      Email: "",
      Name: "",
      Password: '',
      Salt: undefined,
      Status: Status.Online
    }
    const newuser = new User()
    console.log(newuser.setEmail('netoruben@gmail.com'))
  }

  return (
    <div className="App">
      <header className="App-header">
        {message}
        <img src={logo} className="App-logo" alt="logo" />
        <p onClick={click}>Click</p>
      </header>
    </div>
  )
}

export default App;
