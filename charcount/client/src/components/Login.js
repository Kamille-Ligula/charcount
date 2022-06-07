import React, { useState } from "react";
import {AccountRecovery} from './AccountRecovery';
import {Register} from './Register';
import '../styles/charcount.css';
const { createRandomString } = require("../lib/createRandomString");

export function Login(props) {
  const [userName, setuserName] = useState('');
  const [password, setpassword] = useState('');
  const [registration, setregistration] = useState(false);
  const [recovery, setrecovery] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();

    const connectionToken = sessionStorage.getItem('CharcountConnectionToken') || createRandomString(userName, 32, 16, 2);
    sessionStorage.setItem('CharcountConnectionToken', connectionToken);

    props.setuser({
      userName: userName,
      password: password,
      connectionToken: connectionToken,
      connectionType: 'login',
    });
  }

  function turnOnRegistration() {
    setregistration(true);
  }

  function turnOnRecovery() {
    setrecovery(true);
  }

  return (
    <div>
      {!registration && !recovery ?
        <div>
          <form className="centerLogin" onSubmit={(e) => handleSubmit(e)}>
            <table className='center'>
              <tbody>
                <tr>
                  <td colSpan="2">Already have an account?</td>
                </tr>
                <tr>
                  <td>Name:</td>
                  <td>
                    <input
                      type="text"
                      value={userName}
                      onChange={(e) => setuserName(e.target.value)}
                    />
                  </td>
                </tr>
                <tr>
                  <td>Password:</td>
                  <td>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setpassword(e.target.value)}
                    />
                  </td>
                </tr>
                <tr>
                  <td colSpan="2">
                    <input className='mid' value='Sign in' type="submit" />
                  </td>
                </tr>

                <tr>
                  <td style={{paddingTop: '15px'}} colSpan="2">Need to create one?</td>
                </tr>
                <tr>
                  <td colSpan="2">
                    <button className='mid' onClick={() => turnOnRegistration()} >Create account</button>
                  </td>
                </tr>

                <tr>
                  <td style={{paddingTop: '15px'}} colSpan="2">Forgot your password?</td>
                </tr>
                <tr>
                  <td colSpan="2">
                    <button className='mid' onClick={() => turnOnRecovery()} >Recover account</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </form>
        </div>
      :
        registration && !recovery ?
          <div>
            <Register
              setregistration={(data) => setregistration(data)}
              setcreateUser={(data) => {
                props.setcreateUser(data);
                setregistration(false);
              }}
            />
          </div>
        :
          <div>
            <AccountRecovery
              setrecovery={(data) => setrecovery(data)}
              setrecoverUser={(data) => props.setrecoverUser(data)}
              setresetPassword={(data) => props.setresetPassword(data)}
            />
          </div>
      }
    </div>
  )
}
