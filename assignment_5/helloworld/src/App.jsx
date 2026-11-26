import { useEffect, useState } from 'react'
import './App.css'
const API_KEY = import.meta.env.VITE_TMDB_KEY;
const QUERY = "spielberg";

function App() {
  const [persons, setPersons] = useState([]);
  const [index, setIndex] = useState(0);
  useEffect(() => {
    fetch(`https://api.themoviedb.org/3/search/person?query=${QUERY}&api_key=${API_KEY}`)
    .then(res => res.json())
    .then((data) => {
      console.log(data);
      setPersons(data.results);
    })
  }, []); 
  return (
    <div>
      {persons.length > 0 &&
      <Person person={persons[index]}></Person>
      }
      <MyButton lable = "Back"  onClick={onClickLeft} disabled={index === 0}></MyButton>
      <MyButton lable = "Forward" onClick={onClickRight} disabled={index === persons.length-1}></MyButton>
    </div>
  );

  function onClickRight(){
  setIndex(index + 1);
}

function onClickLeft(){
  setIndex(index - 1);
}
}

function Person(props) {
  return (
    <div>
      <p>{props.person.name}</p>
      <p>{props.person.known_for_department}</p>
    </div>
  )
}

function MyButton({lable, onClick, disabled }) {
  return (
    <button onClick={onClick} disabled={disabled}>
      {lable}
    </button>
  );
}

export default App
