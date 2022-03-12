import React, {useState} from "react";
import { useForm } from "react-hook-form";
import { getRandomNumber, sOrP, orderify } from './helpers'
import words from './words.json'

export default function Game() {
  const [points, setPoints] = useState(0);
  const [verbObject, setVerbObject] = useState({"word":'sein', "translation":"to be"});
  const [answer, setAnswer] = useState('bin');
  const [person, setPerson] = useState('1st')
  const [number, setNumber] = useState('Singular')
  const [incorrect, setIncorrect] = useState('')
  const [transActive, setTransActive] = useState(false)
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const onSubmit = data => {
    console.log(data);
    let newPoints
    if (data['guess'] === answer) {
      newPoints = points + 5
      setIncorrect('c')
      setTimeout(()=>setIncorrect(''), 3000)
    }
    else{
      newPoints = points - 1
      setIncorrect(answer)
      setTimeout(()=>setIncorrect(''), 10000)
    }
    setPoints(newPoints)
    reset()
    setNewWord()
  }

  const setNewWord = () => {
    let newVerbObject = words[getRandomNumber(100)]
    let newPerson = getRandomNumber(3) + 1
    let newSorP = sOrP(getRandomNumber(2))
    console.log(newVerbObject)
    let newAnswer = newVerbObject["conjugations"][newPerson + newSorP[0]]
    console.log(newPerson + newSorP[0])

    setAnswer(newAnswer)
    setPerson(orderify(newPerson))
    setNumber(newSorP)
    setVerbObject(newVerbObject)
  }



  return (
    <div>
      <div className="points">
        <h2>Your Points: {points} </h2>
        <div>
          {incorrect.length > 1 && <div className="h5 points-down">-1</div> }
          {incorrect.length === 1 && <div className="h5 points-up">+5</div> }
        </div>
      </div>
      <div className="alert alert-info my-tooltip" >
        <div className="top">{verbObject["translation"]} <i></i> </div>
        <h3 className="alert-heading display-3" >{verbObject['word']}</h3>
        <p className="h5" >{person} person | {number} | Present</p>
      </div>
      <form className="m-1" onSubmit={handleSubmit(onSubmit)}>
        <input className="m-1 form-control form-control-lg" {...register("guess", { required: true })} />
        {errors.exampleRequired && <p>You can't sumbit nothing.</p>}
        <input type="submit" className="m-1 btn btn-light"/>
      </form>
      {incorrect.length > 1 && <div className="alert alert-warning">
        <p>The correct conjugation was {incorrect}</p>
      </div>}
    </div>
  );
}
