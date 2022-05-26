import React, { useState, useEffect } from "react";
import '../styles/charcount.css';
import {CSS} from '../styles/styles';

export function NewInput(props) {
  const [state, setstate] = useState(props);
  const [inputValue, setinputValue] = useState('');
  //const [defaultCheck, setdefaultCheck] = useState({});

  useEffect(() => {
    setstate(props);
  }, [props]);

  const handleinputChange = (event) => {
    setinputValue(event.target.value);
  };

  /*const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      submitText(event);
    }
  };*/

  const submitText = (method) => {
    props.setnewInput(inputValue, method);

    setinputValue('');
  }

  function resubmit() {
    props.resubmit();
  }

  return (
    <div>
      <div style={{fontSize: (state.fontsize-4)+'px', marginLeft:'1%'}}>
        <span/* className='noselect'*/>Welcome back, {state.userName}. Do you want to submit a new Chinese text?</span>
        <p/>
        <textarea
          style={{
            backgroundColor: state.theme === 'light' ? '' : '#4B4050',
            color: state.theme === 'light' ? '' : '#FCF3FF',
            width: '79vw',
          }}
          className="textarea"
          name="textarea"
          value={inputValue}
          /*onKeyDown={(event) => { handleKeyDown(event) }}*/
          onChange={handleinputChange}
        />
        <br/>
        <button style={{...CSS.bigText}} className='mid noselect' onClick={() => submitText('full')}>
          Full analysis
        </button>
        <br/>
        <button style={{...CSS.bigText}} className='mid noselect' onClick={() => submitText('character')}>
          Character analysis
        </button>
        {
          state.showRecoveryButton &&
          <div>
            <br/>
            <button style={CSS.bigText} className='mid noselect' onClick={() => resubmit()}>
              Recover last analysis
            </button>
          </div>
        }
        {/*<div>
          <div onChange={onChangeValue}>
            <input type="radio" value={'full'} defaultChecked={defaultCheck['full']} name="notation" />{' Full analysis (we recommend that you keep it under 10000 characters or prepare to face more or less serious latency times)'}<br/>
            <input type="radio" value={'character'} defaultChecked={defaultCheck['character']} name="notation" />{' Character analysis (no character limitation, but no formated text to read either)'}<br/>
          </div>
        </div>*/}
      </div>
      <br/>
    </div>
  )
}
