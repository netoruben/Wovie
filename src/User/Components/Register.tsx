import Message, { MessageType } from '../../Message/Message'
import React, { MouseEvent, ReactElement } from 'react'
import { useMutation } from 'urql'
import logo from '../../logo.svg'
import '../../App.css'

function Register() {
  const Query = `
            mutation createUser($User: createUserInput!) {
                createUser(User: $User) {
                    __typename
                    ...on User {
                        UserID
                        Email
                        Name
                        Password
                        Status
                        JoinedWhen
                    }
                    ...on Error {
                        Message
                    }
                }
            }
        `

  const [message, setMessage] = React.useState<ReactElement>()
  const [updateTodoResult, updateTodo] = useMutation(Query);

  const click = async (e: MouseEvent) => {
    const User = {
        User: {
            Email: 'netoruben@live.com.pt',
            Name: 'Rúben Neto',
            Password: 'Te_19102001',
        }
    }
    //const newuser = new User().setName('netorurwerewrewrweraaaaaa')
    //const newuser = new UserEndpoint(false).createUser({ Email: 'netoruben@live.com.pt', Name: 'Rúben Neto', Password: 'Te_19102001' })
    updateTodo(User).then(Result => {
      const Response = Result.data.createUser
      setMessage(new Message(Response.__typename, Response.Message).getMessage())
      console.log(Result)
      // The result is almost identical to `updateTodoResult` with the exception
      // of `result.fetching` not being set.
      // It is an OperationResult.
  });
    //setMessage(newuser.getMessage())
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

export default Register;