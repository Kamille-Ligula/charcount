const io = require('socket.io-client');

export const initiateSocket = (logins) => {
  const socket = io(process.env.REACT_APP_API_ENDPOINT, {
    withCredentials: true,
    extraHeaders: {
      "my-custom-header": "abcd"
    },
    auth: {
      token: JSON.stringify(logins)
    }
  });

  return socket
}
