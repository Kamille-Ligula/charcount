import React, { useState, useEffect } from "react";
import '../styles/charcount.css';
import {CSS} from '../styles/styles';

export function CharactersList(props) {
  const [state, setstate] = useState(props);
  const [onlySelectedCharacters, setonlySelectedCharacters] = useState(true);
  const [showWords, setshowWords] = useState(false);

  useEffect(() => {
    setstate(props);
  }, [props]);

  function setCharToKnown(value) {
    props.changeCharKnowledgeStatus(value);
    setshowWords(false);
  }

  function switchSelectedAll() {
    const temp = !onlySelectedCharacters;
    setonlySelectedCharacters(temp);
    setshowWords(false);
  }

  function getSentences(key) {
    if (showWords !== key) {
      setshowWords(key);
    }
    else {
      setshowWords(false);
    }
  }

  return (
    <div className='formated_text' style={{width: '77vw'}}>
      {(state.totalChars !== 0 && state.charFrequency.length > 0) ?
        <div>
          <hr/>
          <span style={{fontSize: (state.fontsize-4)+'px'}}>
            Total characters: {state.totalChars}
            <br/>
            Total unique characters: {state.charFrequency.length}
            <br/>
            Ratio: {state.charFrequency.length/state.totalChars*100}%
          </span>
          <br/>
          <hr/>
          <br/>

          <button className='mid noselect' onClick={() => switchSelectedAll()}>
            {
              onlySelectedCharacters ?
                <span>Show all characters</span>
              :
                <span>Show selected characters</span>
            }
          </button>

          <table style={{fontSize: (state.fontsize-2)+'px'}}>
            <thead>
              <tr>
                <th style={{fontSize: (state.fontsize-6)+'px'}}>❌</th>
                {!state.isMobile &&
                  <th style={CSS.chineseText}>號</th>
                }
                <th style={CSS.chineseText}>字</th>

                <th style={CSS.chineseText}>數</th>

                {/*!state.isMobile &&
                  <th style={CSS.chineseText}>句</th>
                */}
                {
                  (
                    state.charsWithDefinitions.length > 0 &&
                    state.wordsWithDefinitions.length > 0 &&
                    showWords !== false
                  ) &&
                    <th style={CSS.chineseText}>詞</th>
                }
              </tr>
            </thead>

            <tbody>
             {state.charFrequency.map((value, key) => (
               (!onlySelectedCharacters || !state.knownCharacters.includes(value.character)) &&
                <tr key={key}>
                  <td
                    style={state.isMobile ? CSS.chartPositionsMobile : CSS.chartPositionsNormal}
                    onClick={() => setCharToKnown(value.character)}
                  >
                    {onlySelectedCharacters && <span style={{fontSize: (state.fontsize-6)+'px'}}>❌</span>}
                  </td>
                  {!state.isMobile &&
                    <td style={state.isMobile ? CSS.chartPositionsMobile : CSS.chartPositionsNormal}>{key+1}</td>}
                  <td style={state.isMobile ? CSS.chartPositionsMobile : CSS.chartPositionsNormal} onClick={() => getSentences(key)}>{value.character}</td>

                  <td style={state.isMobile ? CSS.chartPositionsMobile : CSS.chartPositionsNormal}>{value.occurences}</td>

                  {showWords === key && <td>
                    <table>
                      <tbody>
                        {state.wordsWithDefinitions.filter(function(item, index) {
                          if (item.traditional.includes(value.character) || item.simplified.includes(value.character) || state.wordsWithDefinitions.length === index+1) { return true }
                          else { return false }
                        }).map((value1, key1) => (
                          value1.traditional.includes(value.character) || value1.simplified.includes(value.character) ?
                            <tr key={key1}>
                              {value1.traditional !== value1.simplified ?
                                <td style={CSS.chartPositionsNormal}>{value1.traditional+' ('+value1.simplified+')'}</td>
                              :
                                <td style={CSS.chartPositionsNormal}>{value1.traditional}</td>
                              }

                              {Object.entries(value1).map(([key2,value2]) => (
                                key2 === 'definitions' &&
                                  <td style={CSS.chartPositionsNormal} key={key2}><table><tbody>
                                    {Object.entries(value2).map(([key3,value3]) => (
                                      <tr key={key3}>
                                        {Object.entries(value3).map(([key4,value4]) => (
                                          key4 === 'translations' ?
                                            <td style={CSS.chartPositionsNormal} key={key4}>
                                              {value4.map((value5, key5) => (
                                                <div key={key5}>&nbsp;</div>
                                              ))}
                                            </td>
                                          :
                                            key4 === 'pinyin' && <td style={CSS.chartPositionsNormal} key={key4}>{value4}</td>
                                        ))}
                                      </tr>
                                    ))}
                                  </tbody></table></td>
                              ))}

                              {Object.entries(value1).map(([key2,value2]) => (
                                key2 === 'definitions' &&
                                  <td style={CSS.chartPositionsNormal} key={key2}><table><tbody>
                                    {Object.entries(value2).map(([key3,value3]) => (
                                      <tr key={key3}>
                                        {Object.entries(value3).map(([key4,value4]) => (
                                          key4 === 'translations' ?
                                            <td style={CSS.chartPositionsNormal} key={key4}>
                                              {value4.map((value5, key5) => (
                                                <div key={key5}>{value5}</div>
                                              ))}
                                            </td>
                                          :
                                            key4 === 'pinyin' && <td style={CSS.chartPositionsNormal} key={key4}>{''}</td>
                                        ))}
                                      </tr>
                                    ))}
                                  </tbody></table></td>
                              ))}

                              {!state.isMobile && Object.entries(value1).map(([key2,value2]) => (
                                key2 === 'traditional' ?
                                  <td style={CSS.chartPositionsNormal} key={key2}>
                                    <a href={'https://www.zdic.net/hans/'+value2} target="_blank" rel="noreferrer">ZDIC</a>
                                  </td>
                                : key2 === 'simplified' &&
                                  <td style={CSS.chartPositionsNormal} key={key2}>
                                    <a href={'https://www.mdbg.net/chinese/dictionary?page=worddict&wdrst=1&wdqb='+value2} target="_blank" rel="noreferrer">MDBG</a>
                                  </td>
                              ))}
                            </tr>
                          :
                            key1 === 0 && <tr key={key1}><td colSpan='3'>no word combinations data</td></tr>
                        ))}

                        {state.charsWithDefinitions.filter(function(item, index) {
                          if (item.traditional.includes(value.character) || item.simplified.includes(value.character) || state.charsWithDefinitions.length === index+1) { return true }
                          else { return false }
                        }).map((value1, key1) => (
                            value1.traditional.includes(value.character) || value1.simplified.includes(value.character) ?
                              <tr key={key1}>
                                {value1.traditional !== value1.simplified ?
                                  <td style={CSS.chartPositionsNormal}>{value1.traditional+' ('+value1.simplified+')'}</td>
                                :
                                  <td style={CSS.chartPositionsNormal}>{value1.traditional}</td>
                                }

                                {Object.entries(value1).map(([key2,value2]) => (
                                  key2 === 'definitions' &&
                                    <td style={CSS.chartPositionsNormal} key={key2}><table><tbody>
                                      {Object.entries(value2).map(([key3,value3]) => (
                                        <tr key={key3}>
                                          {Object.entries(value3).map(([key4,value4]) => (
                                            key4 === 'translations' ?
                                              <td style={CSS.chartPositionsNormal} key={key4}>
                                                {value4.map((value5, key5) => (
                                                  <div key={key5}>&nbsp;</div>
                                                ))}
                                              </td>
                                            :
                                              key4 === 'pinyin' && <td style={CSS.chartPositionsNormal} key={key4}>{value4}</td>
                                          ))}
                                        </tr>
                                      ))}
                                    </tbody></table></td>
                                ))}

                                {Object.entries(value1).map(([key2,value2]) => (
                                  key2 === 'definitions' &&
                                    <td style={CSS.chartPositionsNormal} key={key2}><table><tbody>
                                      {Object.entries(value2).map(([key3,value3]) => (
                                        <tr key={key3}>
                                          {Object.entries(value3).map(([key4,value4]) => (
                                            key4 === 'translations' ?
                                              <td style={CSS.chartPositionsNormal} key={key4}>
                                                {value4.map((value5, key5) => (
                                                  <div key={key5}>{value5}</div>
                                                ))}
                                              </td>
                                            :
                                              key4 === 'pinyin' && <td style={CSS.chartPositionsNormal} key={key4}>{''}</td>
                                          ))}
                                        </tr>
                                      ))}
                                    </tbody></table></td>
                                ))}

                                {!state.isMobile && Object.entries(value1).map(([key2,value2]) => (
                                  key2 === 'traditional' ?
                                    <td style={CSS.chartPositionsNormal} key={key2}>
                                      <a href={'https://www.zdic.net/hans/'+value2} target="_blank" rel="noreferrer">ZDIC</a>
                                    </td>
                                  : key2 === 'simplified' &&
                                    <td style={CSS.chartPositionsNormal} key={key2}>
                                      <a href={'https://www.mdbg.net/chinese/dictionary?page=worddict&wdrst=1&wdqb='+value2} target="_blank" rel="noreferrer">MDBG</a>
                                    </td>
                                ))}
                              </tr>
                            :
                              key1 === 0 && <tr key={key1}><td colSpan='3'>no data on singled-out character</td></tr>
                          ))}
                      </tbody>
                    </table>
                  </td>}
                </tr>
              ))}
            </tbody>
          </table>
          <br/>
        </div>
      :
        <div className="center">
          Finalizing text processing...
          <p/>(provided there is any text to process, otherwise waiting for you to input some)...
        </div>
      }
    </div>
  )
}
