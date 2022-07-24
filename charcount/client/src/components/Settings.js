import React, { useState, useEffect } from "react";
import { SketchPicker } from 'react-color';
import '../styles/charcount.css';

export function Settings(props) {
  const [state, setstate] = useState(props);
  const [colorChanger, setcolorChanger] = useState(false);
  const [colorChangerProperties, setcolorChangerProperties] = useState({theme: 'light', tone: 0});

  const tones = ['Undefined tone*: 抹', 'Tone 1: 媽', 'Tone 2: 麻', 'Tone 3: 馬', 'Tone 4: 罵', 'Tone 5: 嗎'];

  const themeToggler = () => {
    let newTheme;
    props.theme === 'light' ? newTheme = 'dark' : newTheme = 'light'
    props.settheme(newTheme);
    localStorage.setItem("themeCharcount", newTheme);
  }

  function changeFontSize(sign) {
    let temp = props.fontsize;
    if (sign === '+1' || temp > 10) {
      temp = temp + parseInt(sign);
      props.setfontsize(temp);
      localStorage.setItem("fontsizeCharcount", temp);
    }
  }

  useEffect(() => {
    setstate(props);
  }, [props]);

  return (
    <div>
      {colorChanger &&
        <div>
          <div
            style={{position: 'fixed', top: '0%', left: '0%', width: '100vw', height: '100vh'}}
            onClick={() => {
              setcolorChanger(false);
            }}
          >
          </div>
          <div className="centerDef" style={{backgroundColor: '#636363', fontSize: (state.fontsize-4)+'px'}}>
            <SketchPicker
            color={
              colorChangerProperties.theme === 'light' ?
                state.lightToneColors[colorChangerProperties.tone]
              :
                state.darkToneColors[colorChangerProperties.tone]
            }
            onChangeComplete={ (color) => {
              const toneColorsTemp =
                colorChangerProperties.theme === 'light' ?
                  [...state.lightToneColors]
                :
                  [...state.darkToneColors]
              ;
              toneColorsTemp[colorChangerProperties.tone] = color.hex;
              if (colorChangerProperties.theme === 'light') {
                props.setlightToneColors([...toneColorsTemp])
              }
              else {
                props.setdarkToneColors([...toneColorsTemp])
              }
            }}
          />
          </div>
        </div>
      }

      <div style={{ fontSize: state.fontsize*1.5+'px' }}>Settings</div>
      <hr/>

      {/* Text size */}
      <span style={{ fontSize: state.fontsize*1.1+'px', fontWeight: 'bold' }}>Text size:</span>
      &nbsp;<span
        style={{
          fontSize: state.fontsize*1+'px',
        }}
        className='noselect'
      >
        <span onClick={() => { changeFontSize('-1') }}>🔻</span>
          {state.fontsize}
        <span onClick={() => { changeFontSize('+1') }}>🔺</span>
      </span>

      <p/>
      {/* Theme toggler */}
      <span style={{ fontSize: state.fontsize*1.1+'px', fontWeight: 'bold' }}>Theme toggler:</span>
      &nbsp;<span
        className='noselect'
        style={{fontSize: state.fontsize*1+'px'}}
        onClick={themeToggler}
      >
        {state.theme==='light' ? <span>🌙</span> : <span>☀️</span>}
      </span>

      <p/>
      {/* Tone colors */}
      <span style={{ fontSize: state.fontsize*1.1+'px', fontWeight: 'bold' }}>Tones' colors:</span>
      &nbsp;<button className='small noselect' onClick={() => {
        if (state.theme==='light') { props.resetLightTones(); }
        else { props.resetDarkTones(); }
      }}>
        Reset
      </button>

      <table>
        <tbody>
          <tr>
            <td>
              {tones.map((key, index) => (
                <div
                  key={key+index}
                  style={{
                    fontSize: state.fontsize+'px',
                    color: state.theme==='light' ? state.lightToneColors[index] : state.darkToneColors[index],
                    backgroundColor: state.theme==='light' ? 'lightgrey' : '#0C0C0C',
                    padding: '5px',
                  }}
                  onClick={() => {
                    setcolorChanger(true)
                    setcolorChangerProperties({theme: state.theme==='light' ? 'light' : 'dark', tone: index})
                  }}
                >
                  {key}
                </div>
              ))}
            </td>
          </tr>
        </tbody>
      </table>
      *: Undefined tones occur when one character can have more than one tone and the algorithm is unable to tell which one is used in the text. We randomly chose 抹 as an example.
    </div>
  )
}
