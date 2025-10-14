import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <header className="App-header">
        <h1>Bienvenido a React con Vite</h1>
        <div className="card">
          <button onClick={() => setCount((count) => count + 1)}>
            Contador: {count}
          </button>
        </div>
        <p>
          Edita <code>src/App.jsx</code> y guarda para ver los cambios
        </p>
      </header>
    </div>
  )
}

export default App