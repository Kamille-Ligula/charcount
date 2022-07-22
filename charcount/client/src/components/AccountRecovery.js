import React, { useState, useEffect } from "react";
import '../styles/charcount.css';

export function AccountRecovery(props) {
  const [state, setstate] = useState(props);
  const [emailOrName, setemailOrName] = useState('');
  const [userName, setuserName] = useState('');
  const [recoveryPassword, setrecoveryPassword] = useState('');
  const [password, setpassword] = useState('');
  const [confirmPassword, setconfirmPassword] = useState('');

  useEffect(() => {
    setstate(props);
  }, [props]);

  const handleRecovery = (event) => {
    event.preventDefault();

    props.setrecoverUser({
      userName: emailOrName,
      connectionType: 'recover',
    });
  }

  const handleResetting = (event) => {
    event.preventDefault();

    if (confirmPassword === password) {
      props.setresetPassword({
        userName: userName,
        recoveryPassword: recoveryPassword,
        password: password,
        connectionType: 'reset',
      });
    }
    else {
      alert('Passwords don\'t match')
    }

    back();
  }

  function back() {
    props.setrecovery(false);
  }

  return (
    <div>
      {state.accountRecoveryWindow ?
        <div>
          <form className="centerLogin" onSubmit={(e) => handleRecovery(e)}>
            <table className='center'>
              <tbody>
                <tr>
                  <td colSpan="2">Get recovery password:</td>
                </tr>
                <tr>
                  <td>Name or email address:</td>
                  <td>
                    <input
                      type="text"
                      value={emailOrName}
                      onChange={(e) => setemailOrName(e.target.value)}
                    />
                  </td>
                </tr>
                <tr>
                  <td colSpan="2">
                    <input className='mid' value='Send recovery email' type="submit" />
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
      :
        <div>
          <form className="centerLogin" onSubmit={(e) => handleResetting(e)}>
            <table className='center'>
              <tbody>
                <tr>
                  <td colSpan="2">Password resetting:</td>
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
                  <td>Email recovery password:</td>
                  <td>
                    <input
                      type="password"
                      value={recoveryPassword}
                      onChange={(e) => setrecoveryPassword(e.target.value)}
                    />
                  </td>
                </tr>
                <tr>
                  <td>New password:</td>
                  <td>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setpassword(e.target.value)}
                    />
                  </td>
                </tr>
                <tr>
                  <td>Confirm new password:</td>
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
                    <input className='mid' value='Confirm new password' type="submit" />
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
      }
    </div>
  )
}
