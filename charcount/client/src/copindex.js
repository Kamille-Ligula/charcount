import React, { useState, useEffect } from "react";
import ReactDOM from 'react-dom';

import SideBar from "./components/Sidebar";
import {NewInput} from './components/NewInput';
import {CharactersList} from './components/CharactersList';
import {KnownCharactersList} from './components/KnownCharactersList';
import {WordsList} from './components/WordsList';
import {FormatedText} from './components/FormatedText';
import {FormatedTextBottomTable} from './components/FormatedTextBottomTable';
import {Login} from './components/Login';
//import {highlightText, formatInput} from './formatAndHighlight';

import {progress_bar} from './img/index';

import { ThemeProvider } from "styled-components";
import { GlobalStyles } from "./lib/globalStyles";

import {CSS} from './styles/styles';
import './styles/charcount.css';

const io = require('socket.io-client');

let socket;

const initiateSocket = () => {
  socket = io(process.env.REACT_APP_API_ENDPOINT, {
    withCredentials: true,
    extraHeaders: {
      "my-custom-header": "abcd"
    },
    auth: {
      token: "abc"
    }
  });
}

function App(props) {
  const [pages, setpages] = useState(
    {
      'New': {
        name: 'New text',
        address: 'new_input',
      },
      'Formated': {},
      'Vocabulary': {},
      'Characters': {},
      'Known': {
        name: 'Known characters',
        address: 'known_characters',
      },
      'Disconnect': {},
    }
  );
  const [theme, settheme] = useState(localStorage.getItem("themeCharcount") || 'light');

  const [showElements, setshowElements] = useState({
    new_input: true,
    formated_text: false,
    vocabulary: false,
    characters: false,
    progress_bar: false,
    known_characters: false,
    disconnect: false,
  });
  const [colorElements, setcolorElements] = useState({
    new_input:'#008678',
    formated_text:'#E3FFFC',
    vocabulary:'#E3FFFC',
    characters:'#E3FFFC',
    known_characters:'#E3FFFC',
    disconnect:'#E3FFFC',
  });

  const [totalChars, settotalChars] = useState(0);
  const [charFrequency, setcharFrequency] = useState([]);
  const [wordsWithDefinitions, setwordsWithDefinitions] = useState([]);
  const [charsWithDefinitions, setcharsWithDefinitions] = useState([]);
  const [knownCharacters, setknownCharacters] = useState([]);
  const [showProgress, setshowProgress] = useState(progress_bar[1]);
  const [methodOfAnalysis, setmethodOfAnalysis] = useState('');
  const [highlightedWordsArray] = useState([]);
  const [allowSelection, setallowSelection] = useState(false);
  const [text, settext] = useState();
  const [userName, setuserName] = useState(localStorage.getItem('CharcountUserName' || ''));
  const [seachWordData, setseachWordData] = useState();
  const [showRecoveryButton, setshowRecoveryButton] = useState(false);
  const [windowWidth, setwindowWidth] = useState(window.innerWidth);
  //const [windowHeight, setwindowHeight] = useState(window.innerHeight);
  const [fontsize, setfontsize] = useState(parseInt(localStorage.getItem("fontsizeCharcount")) || 24);

  //let isVertical: boolean = (windowWidth/windowHeight < 1);
  let isMobile: boolean = (windowWidth <= 500);

  useEffect(() => {
    const pagesTemp = pages;

    if (text) {
      pagesTemp['Formated'] = {
        name: 'Formated text',
        address: 'formated_text',
      };
    }

    if (wordsWithDefinitions.length > 0) {
      pagesTemp['Vocabulary'] = {
        name: 'Vocabulary',
        address: 'vocabulary',
      };
    }

    if (totalChars !== 0 && charFrequency.length > 0) {
      pagesTemp['Characters'] = {
        name: 'Characters',
        address: 'characters',
      };
      pagesTemp['Known'] = {
        name: 'Known characters',
        address: 'known_characters',
      };
    }

    if (userName) {
      pagesTemp['Disconnect'] = {
        name: 'Disconnect',
        address: 'disconnect',
      };
    }

    setpages(pagesTemp);
  }, [totalChars, charFrequency, wordsWithDefinitions, text, pages, userName]);

  function handleWindowSizeChange() {
    setwindowWidth(window.innerWidth);
  }

  useEffect(() => {
    window.addEventListener('resize', handleWindowSizeChange);
    return () => {
      window.removeEventListener('resize', handleWindowSizeChange);
    }
  }, []);

  function sendNewHighlightedWord(data) {
    if (data !== '') {
      highlightedWordsArray.push(data);
      socket.emit('newhighlightedWord', {
        newhighlightedWord: data,
        userName: userName,
      });
    }
  }

  useEffect(() => {
    initiateSocket();

    if (socket) {
      socket.on('processedInputAPI', (data) => {
        if (data.text) {
          if (data.trunkateAt !== 0) {
            const copy = data.text;
            copy.splice(0, data.trunkateAt);
            settext(copy);
          }
          else {
            settext(data.text)
          }
        };
        if (data.charsWithDefinitions) { setcharsWithDefinitions(data.charsWithDefinitions) };
        if (data.wordsWithDefinitions) { setwordsWithDefinitions(data.wordsWithDefinitions) };
        settotalChars(data.totalChars);
        setcharFrequency(data.charFrequency);
      });

      socket.on('highlightAPI', function(data) {
        if (data.text) {
          if (data.trunkateAt !== 0) {
            const copy = data.text;
            copy.splice(0, data.trunkateAt);
            settext(copy);
          }
          else {
            settext(data.text)
          }
        };
      });

      socket.on('errorAPI', function(data) {
        alert(data);
      });

      socket.on('unlockFeatureAPI', function(data) {
        if (data === 'RecoveryButton') {
          setshowRecoveryButton(true);
          localStorage.setItem('showRecoveryButton', 'true');
        }
      });

      socket.on('KnownCharactersAPI', function(data) {
        setknownCharacters(data);
      });

      socket.on('userLoggedInAPI', function(data) {
        setuserName(data);
        localStorage.setItem('CharcountUserName', data);
      });

      socket.on('methodOfAnalysisAPI', function(data) {
        setmethodOfAnalysis(data);
      });

      socket.on('wordDataAPI', function(data) {
        setseachWordData(data);
      });

      socket.on('ProgressBarAPI', function(data) {
      setshowProgress(progress_bar[data]);
      if (data === 21 || data === null) {
        switchShowElements('characters');
        setshowProgress(progress_bar[0]);
      }
    });

      socket.on('disconnect', (reason) => {
        if (reason === 'io server disconnect') {
          socket.connect();
        }
      });

      if (localStorage.getItem('showRecoveryButton') === 'true') { setshowRecoveryButton(true) }

      return () => socket.disconnect();
    }
  }, []);

  function sendKnownCharacter(data) {
    if (data) {
      const knownCharactersTemp = [...knownCharacters];
      knownCharactersTemp.push(data);
      setknownCharacters(knownCharactersTemp);
      socket.emit('clientSendKnownChar', {
        newKnownCharacter: data,
        userName: userName,
      });
    }
  }

  function sendUnknownCharacter(data) {
    if (data) {
      const knownCharactersTemp = [...knownCharacters];
      knownCharactersTemp.splice(knownCharactersTemp.indexOf(data), 1);
      setknownCharacters(knownCharactersTemp);
      socket.emit('clientSendUnknownChar', {
        newUnknownCharacter: data,
        userName: userName,
      });
    }
  }

  function changeMethodOfAnalysis(data) {
    setmethodOfAnalysis(data);
    socket.emit('methodOfAnalysis', {
      methodOfAnalysis: data,
      userName: userName,
    })
  }

  function sendNewInput(data) {
    if (data.length !== 0) {
      socket.emit('clientinput', {
        newInput: data,
        userName: userName,
      })

      settext();
      settotalChars(0);

      setcharFrequency([]);

      setcharsWithDefinitions([]);
      setwordsWithDefinitions([]);

      switchShowElements('progress_bar')
    }
  }

  function switchShowElements(which) {
    const data = {
      new_input:false,
      formated_text:false,
      vocabulary:false,
      characters:false,
      progress_bar:false,
      disconnect:false,
    };
    data[which] = true;
    setshowElements(data);

    const colors = {
      new_input:'#E3FFFC',
      formated_text:'#E3FFFC',
      vocabulary:'#E3FFFC',
      characters:'#E3FFFC',
      known_characters:'#E3FFFC',
      disconnect:'#E3FFFC',
    };
    colors[which] = '#008678';
    setcolorElements(colors);
    window.scrollTo(0, 0);
  }

  return (
    <ThemeProvider theme={theme === 'light' ? CSS.lightTheme : CSS.darkTheme}><GlobalStyles/>
      <div>
        {userName ?
          <div
            style={isMobile ? {...CSS.belowNavBar} : {...CSS.nextToNavBar}}
          >
            {showElements['new_input'] && <NewInput
              theme={theme}
              fontsize={fontsize}
              setnewInput={
                (data) => {
                  sendNewInput(data);
                }
              }
              showRecoveryButton={showRecoveryButton}
              methodOfAnalysis={methodOfAnalysis}
              setmethodOfAnalysis={
                (data) => {
                  changeMethodOfAnalysis(data);
                }
              }
              resubmit={() => {
                socket.emit('resubmit', {userName: userName})

                settext();
                settotalChars(0);

                setcharFrequency([]);

                setcharsWithDefinitions([]);
                setwordsWithDefinitions([]);
              }}
            />}

            {showElements['progress_bar'] && showProgress }

            {showElements['characters'] && <CharactersList
              totalChars={totalChars}
              theme={theme}
              fontsize={fontsize}

              charFrequency={charFrequency}

              knownCharacters={knownCharacters}
              wordsWithDefinitions={wordsWithDefinitions}
              charsWithDefinitions={charsWithDefinitions}
              changeCharKnowledgeStatus={
                (data) => {
                  sendKnownCharacter(data);
                }
              }
              isMobile={isMobile}
            />}

            {showElements['known_characters'] && <KnownCharactersList
              theme={theme}

              knownCharacters={knownCharacters}
              changeCharKnowledgeStatus={
                (value) => {
                  sendUnknownCharacter(value);
                }
              }
              isMobile={isMobile}
              fontsize={fontsize}
              setsaveToJSON={
                (data) => {
                  socket.emit('saveToJSON', {
                    userName: userName,
                  })
                }
              }
              setimportJSON={
                (selectedFile) => {
                  socket.emit('importJSON', {
                    userName: userName,
                    import: selectedFile,
                  })

                  /*const url = process.env.REACT_APP_API_ENDPOINT+'/import/knownchars';
                  fetch(url, {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: selectedFile,
                  })
                  .then(response => response.json())
                  .catch((error) => { console.error(error) });*/
                }
              }
            />}

            {showElements['vocabulary'] && <WordsList
              theme={theme}
              wordsWithDefinitions={wordsWithDefinitions}
              isMobile={isMobile}
              fontsize={fontsize}
              setsaveToXLSX={
                (data) => {
                  socket.emit('saveToXLSX', {
                    userName: userName,
                  })
                }
              }
            />}

            {showElements['formated_text'] &&
            <div>
              <FormatedText
                text={text}
                settext={ (text) => settext(text) }
                settrunkateAt={ (key) => socket.emit('trunkateAt', {
                  key: key+1,
                  userName: userName,
                }) }
                setsearchWord={
                  (data) => {
                    if (data && data.isChinese) {
                      socket.emit('searchWordInText', {
                        searchWord: data,
                        userName: userName,
                      })
                    }
                    else {
                      setseachWordData(null);
                    }
                  }
                }
                seachWordData={seachWordData}
                isMobile={isMobile}
                theme={theme}
                fontsize={fontsize}
                allowSelection={allowSelection}
                wordsWithDefinitions={wordsWithDefinitions}
                charsWithDefinitions={charsWithDefinitions}
                highlightedWordsArray={highlightedWordsArray}
              />
              <FormatedTextBottomTable
                wordsWithDefinitions={wordsWithDefinitions}
                charsWithDefinitions={charsWithDefinitions}
                isMobile={isMobile}
                theme={theme}
                fontsize={fontsize}
                setnewhighlightedWord={(data) => {sendNewHighlightedWord(data)}}
                allowSelection={allowSelection}
                setallowSelection={(data) => {setallowSelection(data)}}
              />
            </div>
          }

            {!showElements['progress_bar'] && <SideBar
              pageWrapId={"page-wrap"}
              outerContainerId={"App"}
              theme={theme}
              settheme={(data) => settheme(data)}
              fontsize={fontsize}
              setfontsize={(data) => setfontsize(data)}
              windowWidth={windowWidth}

              isMobile={isMobile}

              colorElements={colorElements}
              pages={pages}
              setshowElements={(data) => {
                if (data === 'disconnect') {
                  setuserName('');
                  localStorage.setItem('CharcountUserName', '');
                }
                else {
                  switchShowElements(data)
                }
              }}
            />}
          </div>
        :
          <div>
            <Login
              setuser={(data) => {
                socket.emit('loginCharcount', data)
                /*postloginAPI(data)

                setmethodOfAnalysis('');
                setuserName();
                setknownCharacters([]);*/
              }}
              setcreateUser={(data) => {
                socket.emit('registerCharcount', data)
                /*postregisterAPI(data)

                setmethodOfAnalysis('');
                setuserName();
                setknownCharacters([]);*/
              }}
            />
          </div>
        }
      </div>
    </ThemeProvider>
  )
}

ReactDOM.render(<App />, document.getElementById('root'));
