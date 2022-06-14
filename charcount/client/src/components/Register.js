import React, { useState } from "react";
import '../styles/charcount.css';
const { createRandomString } = require("../lib/createRandomString");
const { isEmailValid } = require("../lib/isEmailValid");

export function Register(props) {
  const [userName, setuserName] = useState('');
  const [email, setemail] = useState('');
  const [confirmEmail, setconfirmEmail] = useState('');
  const [password, setpassword] = useState('');
  const [confirmPassword, setconfirmPassword] = useState('');

  const handleRegister = (event) => {
    event.preventDefault();

    if (!isEmailValid(email)) {
      alert('The format of your email address is not valid');
      return;
    }

    if (confirmEmail !== email) {
      alert('Emails don\'t match');
      return;
    }

    if (confirmPassword !== password) {
      alert('Passwords don\'t match');
      return;
    }

    const connectionToken = sessionStorage.getItem('CharcountConnectionToken') || createRandomString(userName, 32, 16, 2);
    sessionStorage.setItem('CharcountConnectionToken', connectionToken);

    props.setcreateUser({
      userName: userName,
      email: email,
      connectionToken: connectionToken,
      password: password,
      connectionType: 'register',
    });
  }

  function back() {
    props.setregistration(false);
  }

  return (
    <div>
      <div>
        <form className="centerLogin" onSubmit={(e) => handleRegister(e)}>
          <table className='center'>
            <tbody>
              <tr>
                <td colSpan="2">Create a new account:</td>
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
                <td>Email:</td>
                <td>
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setemail(e.target.value)}
                  />
                </td>
              </tr>
              <tr>
                <td>Confirm email:</td>
                <td>
                  <input
                    type="text"
                    value={confirmEmail}
                    onChange={(e) => setconfirmEmail(e.target.value)}
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
                <td>Confirm password:</td>
                <td>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setconfirmPassword(e.target.value)}
                  />
                </td>
              </tr>
              <tr>
                <td colSpan="2">
                  <input className='mid' value='Register' type="submit" />
                </td>
              </tr>
              <tr>
                <td style={{paddingTop: '15px'}} colSpan="2">
                  <button className='small' onClick={() => back()}>Go back to login screen</button>
                </td>
              </tr>
            </tbody>
          </table>
        </form>
      </div>
    </div>
  )
}
