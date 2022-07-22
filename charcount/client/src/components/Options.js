import React, { useState, useEffect } from "react";
import { SketchPicker } from 'react-color';
import '../styles/charcount.css';

export function Options(props) {
  const [state, setstate] = useState(props);
  const [colorChanger, setcolorChanger] = useState(false);
  const [colorChangerProperties, setcolorChangerProperties] = useState({theme: 'light', tone: 0});

  const tones = ['Undefined tone*: 抹', 'Tone 1: 媽', 'Tone 2: 麻', 'Tone 3: 馬', 'Tone 4: 罵', 'Tone 5: 嗎'];

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

      <div style={{ fontSize: state.fontsize*1.5+'px' }}>Options</div>
      <hr/>

      <table>
        <tbody>
          <tr>
            <td>
              <div style={{ fontSize: state.fontsize*1.25+'px' }}>Light tone colors</div>
            </td>

            <td>
              <div style={{ fontSize: state.fontsize*1.25+'px' }}>Dark tone colors</div>
            </td>
          </tr>
          <tr>
            <td>
              {tones.map((key, index) => (
              <div
                key={key+index}
                style={{
                  fontSize: state.fontsize+'px',
                  color: state.lightToneColors[index],
                  backgroundColor: 'lightgrey',
                  padding: '5px',
                }}
                onClick={() => {
                  setcolorChanger(true)
                  setcolorChangerProperties({theme: 'light', tone: index})
                }}
              >
                {key}
              </div>
            ))}
            </td>

            <td>
              {tones.map((key, index) => (
              <div
                key={key+index}
                style={{
                  fontSize: state.fontsize+'px',
                  color: state.darkToneColors[index],
                  backgroundColor: '#0C0C0C',
                  padding: '5px',
                }}
                onClick={() => {
                  setcolorChanger(true)
                  setcolorChangerProperties({theme: 'dark', tone: index})
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
