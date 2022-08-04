const {models} = require('../../src/models');

const {
  lightToneColorsBase,
  darkToneColorsBase
} = require("../../client/src/lib/toneColorsBase");

exports.saveSettings = async (socket, data) => {
  try {
    const User = await models.User.findByLogin(data.userName);

    if (socket.connectionToken === User.connectionToken && socket.id === User.socketid) { // authentication
      if (data.type === 'toneColors') {
        if (data.theme === 'light') {
          if (data.reset === false) {
            await models.User.update(
              {lighttonecolors: data.toneColors},
              {where: {userName: data.userName}},
            );
          }

          if (data.reset === true) {
            await models.User.update(
              {lighttonecolors: lightToneColorsBase},
              {where: {userName: data.userName}},
            );
          }
        }
        
        if (data.theme === 'dark') {
          if (data.reset === false) {
            await models.User.update(
              {darktonecolors: data.toneColors},
              {where: {userName: data.userName}},
            );
          }

          if (data.reset === true) {
            await models.User.update(
              {darktonecolors: darkToneColorsBase},
              {where: {userName: data.userName}},
            );
          }
        }
      }
    }
  }
  catch(e) {
    console.log(e)
  }
}
