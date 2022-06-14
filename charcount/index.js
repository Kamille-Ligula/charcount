const eraseDatabaseOnSync = false;

// API
const { clientSendKnownChar } = require("./lib/clientAPI/clientSendKnownChar");
const { clientSendUnknownChar } = require("./lib/clientAPI/clientSendUnknownChar");
const { clientinput } = require("./lib/clientAPI/clientinput");
const { importJSON } = require("./lib/clientAPI/importJSON");
const { newhighlightedWord } = require("./lib/clientAPI/newhighlightedWord");
const { resubmit } = require("./lib/clientAPI/resubmit");
const { saveToJSON } = require("./lib/clientAPI/saveToJSON");
const { saveToXLSX } = require("./lib/clientAPI/saveToXLSX");
const { searchWordInText } = require("./lib/clientAPI/searchWordInText");
const { trunkateAt } = require("./lib/clientAPI/trunkateAt");

// middlewares
const { register } = require("./lib/clientAPI/middlewares/register");
const { login } = require("./lib/clientAPI/middlewares/login");
const { recover } = require("./lib/clientAPI/middlewares/recover");
const { reset } = require("./lib/clientAPI/middlewares/reset");

const {sequelize} = require('./src/models');

sequelize.sync({ force: eraseDatabaseOnSync });

exports = module.exports = async function(io, app, path) {
  io.use(async (socket, next) => { // middlewares
    register(socket, app)
    login(socket, io)
    recover(socket)
    reset(socket)

    next();
  })

  io.on("connection", async (socket) => {
    socket.on('clientSendKnownChar', async (data) => {
      clientSendKnownChar(socket, data)
    })

    socket.on('clientSendUnknownChar', async (data) => {
      clientSendUnknownChar(socket, data)
    })

    socket.on('searchWordInText', async (data) => {
      searchWordInText(socket, data)
    })

    socket.on('trunkateAt', async (data) => {
      trunkateAt(socket, data)
    })

    socket.on('saveToXLSX', async (data) => {
      saveToXLSX(socket, data, app, path)
    })

    socket.on('saveToJSON', async (data) => {
      saveToJSON(socket, data, app, path)
    })

    socket.on('importJSON', async (data) => {
      importJSON(socket, data)
    })

    socket.on('clientinput', async (data) => {
      clientinput(socket, data)
    })

    socket.on('resubmit', async (data) => {
      resubmit(socket, data)
    })

    socket.on('newhighlightedWord', async (data) => {
      newhighlightedWord(socket, data)
    })
  });
}
