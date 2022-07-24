import React, { useState, useEffect } from "react";
import '../styles/charcount.css';

export function KnownCharactersList(props) {
  const [state, setstate] = useState(props);
  const [selectedFile, setselectedFile] = useState(null);

  useEffect(() => {
    setstate(props);
  }, [props]);

  function saveToJSON() {
    props.setsaveToJSON();
  }

  function importJSON() {
    props.setimportJSON(selectedFile);
  }

  function setCharToUnknown(value) {
    props.changeCharKnowledgeStatus(value);
  }

  const onChangeHandler = (event) => {
    setselectedFile(event.target.files[0])
  }

  return (
    <div className='formated_text'>
      <p/>
      There are currently {state.knownCharacters.length} characters in your list of known characters.
      Clicking on one will send it back to the learning table.
      <br/>NB: each character variants (commonly known as simplified/traditional characters)
      are accounted for separately, as knowing one writing doesn't necessarily
      mean that you can even just recognize the other(s).
      <p/>
      <div
        id='charlist'
        style={{
          backgroundColor: state.theme === 'light' ? 'lightgrey' : '#4B4050',
          borderRadius: '5px',
          fontSize: (state.fontsize-6)+'px',
        }}
      >
        {state.knownCharacters.map((value, key) => (
          <span onClick={() => setCharToUnknown(value)} style={{fontSize: (state.fontsize-2)+'px'}} key={key+value}>{value}</span>
        ))}
      </div>
      <br/>
        <a href={process.env.REACT_APP_API_ENDPOINT+"/downloads/known_characters/"} target="_blank" rel="noreferrer">
        <button className='mid noselect' onClick={() => saveToJSON()}>
          Export list
        </button>
      </a>
      <br/>
      <div>
        <input className='small form-control' type="file" onChange={(e) => onChangeHandler(e)} />
        <button className='mid noselect' onClick={() => importJSON()}>
          Import list
        </button>
      </div>
      <br/>
    </div>
  )
}
