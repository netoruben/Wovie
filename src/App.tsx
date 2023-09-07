import Register from './User/Components/Register'
import { Provider, createClient } from 'urql'

function App() {
  const Client = createClient({
    url: 'http://localhost:3001/api'
  })

  return (
    <Provider value={Client}>
      <Register></Register>
    </Provider>
  )
}

export default App;
