import React, { useState, useEffect } from "react";
import ReactDOM from 'react-dom';

import SideBar from "./components/Sidebar";
import {NewInput} from './components/NewInput';
import {CharactersList} from './components/CharactersList';
import {KnownCharactersList} from './components/KnownCharactersList';
import {WordsList} from './components/WordsList';
import {FormatedText} from './components/FormatedText';
import {FormatedTextBottomTable} from './components/FormatedTextBottomTable';
import {Settings} from './components/Settings';
import {Login} from './components/Login';

import {progress_bar} from './img/index';

import { ThemeProvider } from "styled-components";
import { GlobalStyles } from "./lib/globalStyles";

import { PagesBase } from "./lib/elementsBase";
import { ShowElementsBase } from "./lib/elementsBase";
import { ColorElementsBase } from "./lib/elementsBase";

import { initiateSocket } from "./lib/initiateSocket";

import {CSS} from './styles/styles';
import './styles/charcount.css';

let socket;

const lightToneColorsBase = ['black', 'red', '#CF8700', 'green', 'blue', '#808080'];
const darkToneColorsBase = ['#E7E7E7', '#B84545', '#AA8236', '#2B8E2B', '#7070DA', '#9B9B9B'];

function App(props) {
  const [pages, setpages] = useState(JSON.parse(JSON.stringify(PagesBase)));
  const [theme, settheme] = useState(sessionStorage.getItem("themeCharcount") || 'light');

  const [showElements, setshowElements] = useState({});
  const [colorElements, setcolorElements] = useState({});

  const [totalChars, settotalChars] = useState(0);
  const [charFrequency, setcharFrequency] = useState([]);
  const [wordsWithDefinitions, setwordsWithDefinitions] = useState([]);
  const [charsWithDefinitions, setcharsWithDefinitions] = useState([]);
  const [knownCharacters, setknownCharacters] = useState([]);
  const [showProgress, setshowProgress] = useState(progress_bar[1]);
  const [progressBarText, setprogressBarText] = useState('');
  const [highlightedWordsArray, sethighlightedWordsArray] = useState([]);

  const [lightToneColors, setlightToneColors] = useState(lightToneColorsBase);
  const [darkToneColors, setdarkToneColors] = useState(darkToneColorsBase);

  const [allowSelection, setallowSelection] = useState(false);
  const [text, settext] = useState();
  const [userName, setuserName] = useState(sessionStorage.getItem('CharcountUserName'));
  const [seachWordData, setseachWordData] = useState();
  const [showRecoveryButton, setshowRecoveryButton] = useState(sessionStorage.getItem('showRecoveryButton') || 'false');
  const [start, setstart] = useState(false);
  const [accountRecoveryWindow, setaccountRecoveryWindow] = useState(true);
  const [windowWidth, setwindowWidth] = useState(window.innerWidth);
  //const [windowHeight, setwindowHeight] = useState(window.innerHeight);
  const [fontsize, setfontsize] = useState(parseInt(sessionStorage.getItem("fontsizeCharcount")) || 24);

  //let isVertical: boolean = (windowWidth/windowHeight < 1);
  let isMobile: boolean = (windowWidth <= 500);

  useEffect(() => {
    switchShowElements('new_input')
  }, []);

  useEffect(() => {
    const pagesTemp = pages;

    if (text && text.length > 0) {
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

  function doDisconnection() {
    socket.disconnect();
    setstart(false);
    setuserName();
    sessionStorage.removeItem('CharcountUserName');
    setpages(JSON.parse(JSON.stringify(PagesBase)));
    switchShowElements('new_input')

    settotalChars(0);
    setcharFrequency([]);
    setwordsWithDefinitions([]);
    setcharsWithDefinitions([]);
    setknownCharacters([]);
    sethighlightedWordsArray([]);
    setallowSelection(false);
    settext();
    setseachWordData();
    setshowRecoveryButton(sessionStorage.getItem('showRecoveryButton') || 'false');
  }

  useEffect(() => {
    if (!socket && !start && sessionStorage.getItem('CharcountUserName') && sessionStorage.getItem('CharcountConnectionToken')) {
      const data = {
        userName: sessionStorage.getItem('CharcountUserName'),
        connectionToken: sessionStorage.getItem('CharcountConnectionToken'),
        connectionType: 'login',
      };
      socket = initiateSocket(data);
      setstart(true);
      //socket.emit('loginCharcount', data)
    }

    if (socket && start) {
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

      socket.on('ConnectionFeedbackAPI', function(data) {
        socket.disconnect();
        setstart(false);

        switch (data.title) {
          case 'recovery email sent':
            alert('We sent you a recovery email from the address miranteule@gmail.com to your address '+data.email+'. Please follow the instructions inside in order to recover your account.');
            setaccountRecoveryWindow(false);
            break;
          case 'something went wrong':
            alert('Something went wrong. Try again.');
            break;
          case 'input doesn\'t match user or email':
            alert('Your input doesn\'t match any user or email address from the database. Please make sure you didn\'t type it wrong');
            break;
          case 'password was reset':
            alert('Your password was successfully reset. You can now use it to sign in.');
            break;
          case 'password doesn\'t match or expired':
            alert('Either your recovery password doesn\'t match the one we sent to you by email, or it expired. Remember that recovery passwords are only available for a certain amount of time.');
            break;
          case 'enter email recovery password':
            alert('Please enter the recovery password that was sent to you by email at '+data.email+'.');
            break;
          case 'wrong name':
            alert('Please make sure you didn\'t type your name wrong.');
            break;
          case 'confirmation email sent':
            alert('We sent you a confirmation email from the address miranteule@gmail.com. Please follow the instructions inside in order to complete your registration.');
            break;
          case 'email aready registered':
            alert('This email address has already been registered to another account.');
            break;
          case 'no multi connection allowed':
            alert('You can only be connected in one place at a time. You were disconnected from here because you connected elsewhere. If it wasn\'t you please make sure your connection is safe.');
            doDisconnection();
            break;
          case 'name aready registered':
            alert('This name has already been registered to another account.');
            break;
          case 'no empty field':
            alert('Please fill in all the fields.');
            break;
          case 'wrong identifiers':
            alert('Wrong identifiers');
            break;
          default:
            console.log('ConnectionFeedbackAPI default case');
        }
      });

      socket.on('unlockFeatureAPI', function(data) {
        if (data === 'RecoveryButton') {
          setshowRecoveryButton('true');
          sessionStorage.setItem('showRecoveryButton', 'true');
        }
      });

      socket.on('KnownCharactersAPI', function(data) {
        setknownCharacters(data);
      });

      socket.on('userLoggedInAPI', function(data) {
        setuserName(data);
        sessionStorage.setItem('CharcountUserName', data);
      });

      socket.on('wordDataAPI', function(data) {
        setseachWordData(data);
      });

      socket.on('ProgressBarAPI', function(data) {
        setshowProgress(progress_bar[data]);
        if (data === 21 || data === null) {
          switchShowElements('characters');
          setshowProgress(progress_bar[1]);
        }
      });

      socket.on('ProgressBarTextAPI', function(data) {
        setprogressBarText(data);
      });

      socket.on('disconnect', (reason) => {
        if (reason === 'io server disconnect') {
          socket.connect();
        }
      });

      return () => socket.disconnect();
    }
  }, [start]);

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

  function sendNewInput(input, method) {
    if (input.length !== 0) {
      socket.emit('clientinput', {
        newInput: input,
        method: method,
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
    const data = JSON.parse(JSON.stringify(ShowElementsBase));
    data[which] = true;
    setshowElements(data);

    const colors = JSON.parse(JSON.stringify(ColorElementsBase));
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
              userName={userName}
              setnewInput={
                (input, method) => {
                  sendNewInput(input, method);
                }
              }
              showRecoveryButton={showRecoveryButton}
              resubmit={() => {
                socket.emit('resubmit', {userName: userName})

                settext();
                settotalChars(0);

                setcharFrequency([]);

                setcharsWithDefinitions([]);
                setwordsWithDefinitions([]);
              }}
            />}

            {showElements['progress_bar'] &&
              <div style ={CSS.progress_bar}>
                {showProgress}
                <br/>{progressBarText}
              </div>
            }

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
                }
              }
            />}

            {showElements['settings'] && <Settings
              theme={theme}
              settheme={(data) => settheme(data)}
              fontsize={fontsize}
              setfontsize={(data) => setfontsize(data)}

              isMobile={isMobile}
              lightToneColors={lightToneColors}
              darkToneColors={darkToneColors}
              setlightToneColors={ (data) => setlightToneColors(data) }
              setdarkToneColors={ (data) => setdarkToneColors(data) }
              resetLightTones={ () => setlightToneColors(lightToneColorsBase) }
              resetDarkTones={ () => setdarkToneColors(darkToneColorsBase) }
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
                lightToneColors={lightToneColors}
                darkToneColors={darkToneColors}
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
                  doDisconnection();
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
              accountRecoveryWindow = {accountRecoveryWindow}
              setuser={(data) => {
                socket = initiateSocket(data);
                setstart(true);
              }}
              setcreateUser={(data) => {
                socket = initiateSocket(data);
                setstart(true);
              }}
              setrecoverUser={(data) => {
                socket = initiateSocket(data);
                setstart(true);
              }}
              setresetPassword={(data) => {
                socket = initiateSocket(data);
                setstart(true);
              }}
            />
          </div>
        }
      </div>
    </ThemeProvider>
  )
}

ReactDOM.render(<App />, document.getElementById('root'));
