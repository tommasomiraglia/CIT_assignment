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
      <MyButton label = "Back"  onClick={onClickLeft} disabled={index === 0}></MyButton>
      <MyButton label = "Forward" onClick={onClickRight} disabled={index === persons.length-1}></MyButton>
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
      <ul>{props.person.known_for.map((m) => <KnownFor key={m.id} movie={m}/>)}</ul>
      <ImagesFor id={props.person.id}/>
    </div>
  )
}

function MyButton({label, onClick, disabled }) {
  return (
    <button onClick={onClick} disabled={disabled}>
      {label}
    </button>
  );
}

function KnownFor(props) {
  return (
    <li>
      {props.movie.title}
      {props.movie.release_date}
      {props.movie.overview}
    </li>
  )
}
function ImagesFor(props) {
  const [profiles, setProfiles] = useState([]);
  useEffect(() => {
    fetch(`https://api.themoviedb.org/3/person/${props.id}/images?api_key=${API_KEY}`)
      .then((res) => res.json())
      .then((data) => {
        setProfiles(data.profiles);
      });
  }, [props.id]);
  return (
    <div>
      {profiles.map((p) => (
        <img
          key={p.file_path}
          src={`https://image.tmdb.org/t/p/w185${p.file_path}`}
          alt="Profile"
        />
      ))}
    </div>
  );
}
export default App
