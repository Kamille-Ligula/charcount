import React, { useState, useEffect } from "react";
import '../styles/charcount.css';
import {CSS} from '../styles/styles';

export function WordsList(props) {
  const [state, setstate] = useState(props);

  useEffect(() => {
    setstate(props);
  }, [props]);

  function saveToXLSX() {
    props.setsaveToXLSX();
  }

  return (
    <div className='formated_text' style={{fontSize: (state.fontsize-2)+'px'}}>
      <table>
        <thead>
          <tr>
            {/*!props.isMobile && <th style={CSS.chineseText}>數</th>*/}
            <th style={CSS.chineseText}>詞</th>
            <th style={CSS.chineseText}>音</th>
            <th style={CSS.chineseText}>翻譯</th>
            {!props.isMobile && <th style={CSS.chineseText}>HSK</th>}
            {!props.isMobile && <th style={CSS.chineseText}>聯結</th>}
          </tr>
        </thead>

        <tbody>
          {props.wordsWithDefinitions.map((value1, key1) => (
            <tr key={key1}>
              {/*!props.isMobile && <td style={state.theme === 'light' ? {...CSS.borderedtdLight} : {...CSS.borderedtdDark}} key={key1}>{value1.count}</td>*/}

              {value1.traditional !== value1.simplified ?
                <td style={state.theme === 'light' ? {...CSS.borderedtdLight} : {...CSS.borderedtdDark}}>{value1.traditional+' ('+value1.simplified+')'}</td>
              :
                <td style={state.theme === 'light' ? {...CSS.borderedtdLight} : {...CSS.borderedtdDark}}>{value1.traditional}</td>
              }

              {Object.entries(value1).map(([key2,value2]) => (
                key2 === 'definitions' &&
                  <td style={state.theme === 'light' ? {...CSS.borderedtdLight} : {...CSS.borderedtdDark}} key={key2}><table><tbody>
                    {Object.entries(value2).map(([key3,value3]) => (
                      <tr key={key3}>
                        {Object.entries(value3).map(([key4,value4]) => (
                          key4 === 'translations' ?
                            <td key={key4}>
                              {value4.map((value5, key5) => (
                                <div key={key5}>&nbsp;</div>
                              ))}
                            </td>
                          :
                            key4 === 'pinyin' && <td key={key4}>{value4}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody></table></td>
              ))}

              {Object.entries(value1).map(([key2,value2]) => (
                key2 === 'definitions' ?
                  <td style={state.theme === 'light' ? {...CSS.borderedtdLight} : {...CSS.borderedtdDark}} key={key2}><table><tbody>
                    {Object.entries(value2).map(([key3,value3]) => (
                      <tr key={key3}>
                        {Object.entries(value3).map(([key4,value4]) => (
                          key4 === 'translations' ?
                            <td key={key4}>
                              {value4.map((value5, key5) => (
                                <div key={key5}>{value5}</div>
                              ))}
                            </td>
                          :
                            key4 === 'pinyin' && <td key={key4}>{''}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody></table></td>
                :
                  (!props.isMobile && key2 === 'hsk') &&
                    <td style={state.theme === 'light' ? {...CSS.borderedtdLight} : {...CSS.borderedtdDark}} key={key2}>{value2}</td>
              ))}

              {!props.isMobile && Object.entries(value1).map(([key2,value2]) => (
                key2 === 'traditional' ?
                  <td style={state.theme === 'light' ? {...CSS.borderedtdLight} : {...CSS.borderedtdDark}} key={key2}>
                    <a href={'https://www.zdic.net/hans/'+value2} target="_blank" rel="noreferrer">ZDIC</a>
                  </td>
                : key2 === 'simplified' &&
                  <td style={state.theme === 'light' ? {...CSS.borderedtdLight} : {...CSS.borderedtdDark}} key={key2}>
                    <a href={'https://www.mdbg.net/chinese/dictionary?page=worddict&wdrst=1&wdqb='+value2} target="_blank" rel="noreferrer">MDBG</a>
                  </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <br/>
      <a href={process.env.REACT_APP_API_ENDPOINT+"/downloads/vocabulary_files/"} target="_blank" rel="noreferrer">
        <button style={{...CSS.bigText}} className='big noselect' onClick={() => saveToXLSX()}>
          Download as Excel File
        </button>
      </a>
      <br/>
    </div>
  )
}
