const express = require("express");
const path = require('path');
const http = require("http");
const socketIo = require("socket.io");
const dotenv = require('dotenv').config();
const fs = require('fs');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true
  }
});

app.use(helmet());
app.use(bodyParser.json());
app.use(cors());
app.use(morgan('combined'));

// Serve static files from the React app
app.use('/charcount', express.static(path.join(__dirname, 'charcount/client/build')));

app.get('charcount/', (req, res) => {res.sendFile(path.join(__dirname+'/charcount/client/build/index.html'))});

let numberOfClients = 0;

io.on("connection", (socket) => {
  numberOfClients++;
  console.log(`New client connected (total: ${numberOfClients})`);

  socket.on("disconnect", () => {
    numberOfClients--;
    console.log(`Client disconnected (total: ${numberOfClients})`);
  });
});

const charcount = require('./charcount/index')(io, app, path);

const port = process.env.PORT || 5000;
server.listen(port, () => console.log(`Listening on port ${port}`));
