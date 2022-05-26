import React, { useState } from "react";
import '../styles/charcount.css';

function RandomString(userName) {
  const characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890~!@#$%^&*()_+-=[];,./{}:|<>?";
  const stringLength = (Math.floor(Math.random() * 10))+30;

  let randomString = userName;
  for (let i=0; i<stringLength; i++) {
    randomString = randomString + characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return randomString;
}

export function Register(props) {
  const [userName, setuserName] = useState('');
  const [email, setemail] = useState('');
  const [password, setpassword] = useState('');

  const handleRegister = (event) => {
    event.preventDefault();

    const connectionToken = sessionStorage.getItem('CharcountConnectionToken') || RandomString(userName);
    sessionStorage.setItem('CharcountConnectionToken', connectionToken);

    props.setcreateUser({
      userName: userName,
      email: email,
      connectionToken: connectionToken,
      password: password,
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
                  <input className='mid' value='Register' type="submit" />
                </td>
              </tr>
              <tr>
                <td style={{paddingTop: '15px'}} colSpan="2">
                  <button className='mid' onClick={() => back()}>Go back to login screen</button>
                </td>
              </tr>
            </tbody>
          </table>
        </form>
      </div>
    </div>
  )
}

export function Login(props) {
  const [userName, setuserName] = useState('');
  const [password, setpassword] = useState('');
  const [registration, setregistration] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();

    const connectionToken = sessionStorage.getItem('CharcountConnectionToken') || RandomString(userName);
    sessionStorage.setItem('CharcountConnectionToken', connectionToken);

    props.setuser({
      userName: userName,
      password: password,
      connectionToken: connectionToken,
    });
  }

  function turnOnRegistration() {
    setregistration(true);
  }

  return (
    <div>
      {!registration ?
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
                  <td colSpan="2">Create a new account. We don't use email verification (yet), so losing your password means losing your account. Be more careful next time.</td>
                </tr>
              </tbody>
            </table>
          </form>
        </div>
      :
        <div>
          <Register
            setregistration={(data) => setregistration(data)}
            setcreateUser={(data) => props.setcreateUser(data)}
          />
        </div>
      }
    </div>
  )
}
