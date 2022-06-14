const {models} = require('../../src/models');

exports.saveToXLSX = async (socket, data, app, path) => {
  try {
    const User = await models.User.findByLogin(data.userName);

    if (socket.connectionToken === User.connectionToken && socket.id === User.socketid) { // authentication
      app.get('/downloads/vocabulary_files', (req, res) => {
        const file = 'downloads/vocabulary_files/'+data.userName.replace(/\s/g, '-')+'-vocabulary-list.xlsx';

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
