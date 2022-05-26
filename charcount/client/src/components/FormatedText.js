import React, { useState, useEffect } from "react";
import {FormatedTextDetails} from './FormatedTextDetails';
import '../styles/charcount.css';
import {CSS} from '../styles/styles';

const lightToneColors = ['black', 'red', '#CF8700', 'green', 'blue', '#808080'];
const darkToneColors = ['#E7E7E7', '#B84545', '#AA8236', '#2B8E2B', '#7070DA', '#9B9B9B'];

export function FormatedText(props) {
  const [state, setstate] = useState(props);

  useEffect(() => {
    setstate(props);
  }, [props]);

  function changesearchWord(data) {
    props.setsearchWord(data);
  }

  return (
    <div>
      <div
        style={{
          ...CSS.chineseText,
          paddingBottom: state.isMobile ? '80px' : '40px',
        }}
        className={(state.isMobile && !state.allowSelection) ? 'noselect' : ''}
      >
        {state.text ?
          <div
            className='formated_text'
            style={{
              backgroundColor: state.theme === 'light' ? 'lightgrey' : '#0C0C0C',
              borderRadius: '5px',
              width: '77vw',
            }}
          >
            <div>
              {state.text.map((paragraph, key) =>
                <div key={key}>
                  &emsp;&emsp;
                  {paragraph.map((item, key) =>
                    <span
                      key={key}
                      style={{
                        fontSize: state.fontsize+'px',
                        background:
                          state.theme === 'light' ?
                            item.isHighlighted && 'linear-gradient(180deg,rgba(255,255,255,0) 90%, #000 90%)'
                          :
                            item.isHighlighted && 'linear-gradient(180deg,rgba(255,255,255,0) 90%, #fff 90%)',
                        color: state.theme === 'light' ?
                          lightToneColors[item.tone]
                        :
                          darkToneColors[item.tone]
                      }}
                      onClick={() => {
                        changesearchWord(item);
                      }}
                    >
                      {item.character}
                    </span>
                  )}
                  {
                    key < state.text.length-1 &&
                      <div
                        style={{
                          textAlign: 'center',
                          fontSize: (state.fontsize-6)+'px',
                        }}
                      >
                        <span
                          onClick={() => {
                            const copy = [...state.text]
                            copy.splice(0, key+1)
                            props.settext(copy)
                            props.settrunkateAt(key)
                            window.scrollTo(0, 0);
                          }}
                        >
                        ❌
                        </span>
                        <p className='formattedInputParagraph'/>
                      </div>
                  }
                </div>
              )}
            </div>
            { state.seachWordData &&
              <FormatedTextDetails
                seachWordData={state.seachWordData}
                setsearchWord={(data) => changesearchWord(data)}
                isMobile={state.isMobile}
                fontsize={state.fontsize}
                theme={state.theme}
              />
            }
          </div>
        :
          <div className="center">
            Finalizing text processing...
            <p/>(provided there is any text to process, otherwise waiting for you to input one)...
          </div>
        }
      </div>
    </div>
  )
}
