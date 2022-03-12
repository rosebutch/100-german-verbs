import './App.css';
import Game from './Game'
import {useState} from 'react'

function App() {
  const [instructions, setInstructions] = useState(false);

  const toggleInstructions = () => setInstructions(!instructions)

  return (
    <div className="App">
      <header className="App-header">
        <h1 className='display-1'>✨ 100 German Verbs ✨</h1>
        <Game/>
        <hr/>
        <button onClick={toggleInstructions} className="btn btn-light">How to play</button>
        {instructions && <div className='m-3 alert alert-primary' >
          <p>
            We'll give you one of the 100 most common German Verbs, along with 1st, 2nd, or 3rd person, and singular or plural, and the tense. You get 5 point for each verb you conjugate correctly, and you lose 1 point for each incorrect conjugation. You can hover over the verb for the translation if you need it. Can you earn 100 points?
          </p>
        </div>}
      </header>
    </div>
  );
}

export default App;
