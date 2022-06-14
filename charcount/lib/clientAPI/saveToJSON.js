const {models} = require('../../src/models');
const fs = require('fs');

const {
  findAllKnownCharacters,
} = require("../requeststoDB");

exports.saveToJSON = async (socket, data, app, path) => {
  try {
    const User = await models.User.findByLogin(data.userName);

    if (socket.connectionToken === User.connectionToken && socket.id === User.socketid) { // authentication
      app.get('/downloads/known_characters', async (req, res) => {
        const file = '/downloads/known_characters/'+data.userName.replace(/\s/g, '-')+'-known-characters.json';

        const allKnownChars = await findAllKnownCharacters(data.userName);

        fs.writeFileSync(path.join(__dirname, '..', '..', file), JSON.stringify(allKnownChars));

        res.download(path.join(__dirname, '..', '..', file), function(error) {
          console.log("Error : ", error)
        });
      });
    }
  }
  catch(e) {
    console.log(e)
  }
}
