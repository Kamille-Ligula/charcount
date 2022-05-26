import React, { useState } from "react";
import '../styles/charcount.css';
import {CSS} from '../styles/styles';

export function FormatedTextBottomTable(props) {
  const [highlightedWord, sethighlightedWord] = useState('');
  const [searchWord] = useState('');
  const [searchWordID] = useState(0);
  const [showSearchWord] = useState(false);
  const [allowSelection, setallowSelection] = useState(props.allowSelection);
  const [checked, setchecked] = useState(!props.isMobile);

  function changehighlightedWord(e) {
    sethighlightedWord(e.target.value);
  }

  function sendhighlightedWord() {
    props.setnewhighlightedWord(highlightedWord);
  }

  function changeAllowSelection() {
    setallowSelection(!allowSelection)
    props.setallowSelection(!allowSelection);
  }

  function onChange() {
    setchecked(!checked)
    changeAllowSelection();
  }

  function bottomTable(array) {
    return (
      <table>
        <tbody>
          {Object.entries(array[searchWordID].definitions).map(([key,value]) => (
            <tr key='key' style={CSS.whiteBackground}>
              {array[searchWordID].traditional !== array[searchWordID].simplified ?
                <td style={{
                  ...CSS.chineseText,
                  ...CSS.borderedtd,
                  color: '#000'
                }}>
                  {array[searchWordID].traditional+' ('+array[searchWordID].simplified+')'}
                </td>
              :
                <td style={{
                  ...CSS.chineseText,
                  ...CSS.borderedtd,
                  color: '#000'
                }}>
                  {array[searchWordID].traditional}
                </td>
              }
              <td style={{
                ...CSS.chineseText,
                ...CSS.borderedtd,
                color: '#000'
              }}>
                {value.pinyin}
              </td>
              <td style={{
                ...CSS.chineseText,
                ...CSS.borderedtd,
                color: '#000'
              }}>
                {Object.entries(value).map(([key4,value4]) => (
                  key4 === 'translations' &&
                    <div key={key4}>
                      {value4.map((value5, key5) => (
                        <div key={key5}>{value5}</div>
                      ))}
                    </div>
                ))}
              </td>
              {!props.isMobile &&
              <td style={{...CSS.chineseText, ...CSS.borderedtd}}>
                <a href={'https://www.zdic.net/hans/'+array[searchWordID].traditional} target="_blank" rel="noreferrer">
                  ZDIC
                </a>
              </td>
              }
              {!props.isMobile &&
              <td style={{...CSS.chineseText, ...CSS.borderedtd}}>
                <a href={'https://www.mdbg.net/chinese/dictionary?page=worddict&wdrst=1&wdqb='+array[searchWordID].traditional} target="_blank" rel="noreferrer">
                  MDBG
                </a>
              </td>
              }
            </tr>
          ))}
        </tbody>
      </table>
    )
  }

  return (
    <div>
      {props.wordsWithDefinitions &&
        <div>
          <div style={{backgroundColor: props.theme === 'light' ? '#D9E2FF' : '#02000C', ...CSS.bottomnotes}}>
            {(showSearchWord && searchWord.length > 1) ? bottomTable(props.wordsWithDefinitions)
            : (showSearchWord && searchWord.length === 1) && bottomTable(props.charsWithDefinitions)
            }
            {props.isMobile &&
              <div style={{/*backgroundColor: props.theme === 'light' ? '#D9E2FF' : '#02000C',*/ ...CSS.checkButtons}}>
                <label>
                  <input type="checkbox" checked={checked} onChange={onChange} />
                  <span>Show bottom bar and allow selection</span>
                </label>
              </div>
            }
            <div>
              {//props.isMobile ?
                checked &&
                <table style={CSS.maxWidth95}><tbody>
                  <tr>
                    <td>
                      <input
                        style={{...CSS.width100, ...CSS.chineseText}}
                        type="string"
                        value={highlightedWord}
                        onChange={e => changehighlightedWord(e)}
                      />
                    </td>
                    <td>
                      <button className='small' style={{...CSS.width100, ...CSS.chineseText}} onClick={() => sendhighlightedWord()}>
                        Underline
                      </button>
                    </td>
                  </tr>
                </tbody></table>
              /*:
                <div>
                  <table style={CSS.maxWidth100}><tbody>
                    <tr>
                      <td>

                        <input
                          style={{...CSS.width100, ...CSS.chineseText}}
                          type="string"
                          value={highlightedWord}
                          onChange={e => changehighlightedWord(e)}
                        />
                      </td>
                      <td>
                        <button style={{...CSS.width100, ...CSS.chineseText}} onClick={() => sendhighlightedWord()}>
                          Underline
                        </button>
                      </td>
                    </tr>
                  </tbody></table>
                </div>*/
              }
            </div>
          </div>
        </div>
      }
    </div>
  )
}
