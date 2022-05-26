import React, { useState, useEffect } from "react";
import '../styles/charcount.css';
import {CSS} from '../styles/styles';

export function FormatedTextDetails(props) {
  const [state, setstate] = useState(props);

  useEffect(() => {
    setstate(props);
  }, [props]);

  return (
    <div>
      <div
        style={{position: 'fixed', top: '0%', left: '0%', width: '100vw', height: '100vh'}}
        onClick={() => {
          props.setsearchWord(undefined);
        }}
      >
      </div>

      <div className="centerDef" style={{backgroundColor: '#636363', fontSize: (state.fontsize-4)+'px'}}>
        <table
          style={{
            textAlign: 'left'
          }}
        >
          <tbody>
            {Object.entries(state.seachWordData).map(([keey,vallue]) => (
              <tr key={keey}><td><table><tbody>
              {Object.entries(vallue.definitions).map(([key,value]) => (
                <tr
                  key={key}
                  style={{
                    backgroundColor: state.theme === 'light' ? '#fff' : '#000',
                    textAlign: 'left',
                  }}
                >
                  {vallue.traditional !== vallue.simplified ?
                    <td style={{
                      ...CSS.chineseText,
                      ...CSS.borderedtd,
                      color: state.theme === 'light' ? '#000' : '#E7E7E7',
                    }}>
                      {vallue.traditional+' ('+vallue.simplified+')'}
                    </td>
                  :
                    <td style={{
                      ...CSS.chineseText,
                      ...CSS.borderedtd,
                      color: state.theme === 'light' ? '#000' : '#E7E7E7',
                    }}>
                      {vallue.traditional}
                    </td>
                  }
                  <td style={{
                    ...CSS.chineseText,
                    ...CSS.borderedtd,
                    color: state.theme === 'light' ? '#000' : '#E7E7E7',
                  }}>
                    {value.pinyin}
                  </td>
                  <td style={{
                    ...CSS.chineseText,
                    ...CSS.borderedtd,
                    color: state.theme === 'light' ? '#000' : '#E7E7E7',
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
                    <a href={'https://www.zdic.net/hans/'+vallue.traditional} target="_blank" rel="noreferrer">
                      ZDIC
                    </a>
                  </td>
                  }
                  {!props.isMobile &&
                  <td style={{...CSS.chineseText, ...CSS.borderedtd}}>
                    <a href={'https://www.mdbg.net/chinese/dictionary?page=worddict&wdrst=1&wdqb='+vallue.traditional} target="_blank" rel="noreferrer">
                      MDBG
                    </a>
                  </td>
                  }
                </tr>
              ))}
              </tbody></table></td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
