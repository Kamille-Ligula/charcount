import React, { useState, useEffect } from "react";
import { slide as Menu } from "react-burger-menu";
import '../styles/charcount.css';
import {CSS} from '../styles/styles';
import {logo} from '../img/index';

export default function SideBar(props) {
  const [state, setstate] = useState(props);
  const [menuOpen, setmenuOpen] = useState(false);

  useEffect(() => {
    setstate(props);
  }, [props]);

  function handleOnOpen() {
    setmenuOpen(true)
  }

  function handleOnClose() {
    setmenuOpen(false)
  }

  function changeFontSize(sign) {
    let temp = props.fontsize;
    if (sign === '+1' || temp > 10) {
      temp = temp + parseInt(sign);
      props.setfontsize(temp);
      localStorage.setItem("fontsizeCharcount", temp);
    }
  }

  return (
    state.isMobile ?
      <div
        style={{
          backgroundColor: state.theme === 'light' ? '#D9E2FF' : '#02000C',
          /*borderRadius: '5px',*/
          width: '100%',
          height: 50, // a bit more than burger width (36)
          overflow: 'hidden',
          marginLeft: '-10px',
          position: 'fixed',
          top: 0,
        }}
      >
        <div
          style={{
            width: '40%',
            overflow: 'hidden',
            position: 'fixed',
            textAlign: 'center',
            top: 10,
            left: '30%',
            fontSize: '24px',
          }}
          className='noselect'
        >
          <span onClick={() => { changeFontSize('-1') }}>🔻</span>
            &emsp;{state.fontsize}&emsp;
          <span onClick={() => { changeFontSize('+1') }}>🔺</span>
        </div>

        <Menu isOpen={menuOpen} onOpen={handleOnOpen} onClose={handleOnClose} width={'auto'} {...props}>
          {
            Object.entries(state.pages).map(([key, item]) => (
              <span key={key} onClick={() => { props.setshowElements(item.address); handleOnClose() }}>
                {item.name}
              </span>
            ))
          }
        </Menu>
      </div>
    : /* is computer */
      <div
        className='overflowauto noselect'
        style={{
          backgroundColor: state.theme === 'light' ? '#004F46' : '#001311',
          /*opacity: '0.7',*/
          position: 'fixed',
          left: '0%',
          width: '18vw',
          fontSize: '24px',
        }}
      >
        <div
          style={{
            marginLeft: 'auto',
            marginRight: 'auto',
            width: '50%',
            marginTop: '5%',
            //filter: state.theme === 'dark' && 'invert(60%)',
          }}
        >
          {logo}
        </div>

        <p/>

        <div style={{marginLeft: '20px'}}>
          {
            Object.entries(state.pages).map(([key, item]) => (
              <div style={{color: state.colorElements[item.address]}} key={key} onClick={() => { props.setshowElements(item.address); }}>
                {item.name}
              </div>
            ))
          }
        </div>
      </div>
  );
};
