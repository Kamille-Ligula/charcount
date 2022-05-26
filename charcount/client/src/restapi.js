

/*
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function getRandomChar() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789~!@#$%^&*<>?;:/-+(){}[]|';

  return chars[Math.floor(Math.random() * chars.length)];
}

function randomIdentifier() {
  let random = '';

  const numberOfCharacters = getRandomInt(5) + 20;

  for (let i=0; i<numberOfCharacters; i++) {
    random = random + getRandomChar();
  }

  return random;
}
*/

/*
app.post('/import/knownchars', async (req, res) => {
  try {
    const response = await req.body;
    const User = await models.User.findByLogin(response.userName) || undefined;

    if (!User) {

    }
    console.log(response)
  }
  catch(e) {
    console.log(e)
  }
});

app.get('/users', (req, res) => {
  res.send('');
});

app.post('/register', async (req, res) => {
  try {
    const response = await req.body;
    const User = await models.User.findByLogin(response.userName) || undefined;
    const sessionID = randomIdentifier();
    const methodOfAnalysis = 'full';

    if (!User) {
      await models.User.create(
        {
          userName: response.userName,
          email: response.email,
          password: response.password,
          socketid: sessionID,
          trunkateAt: 0,
          totalChars: 0,
          methodOfAnalysis: methodOfAnalysis,
        },
      );

      app.get('/KnownCharactersAPI', (req, res) => {
        res.send([]);
      });

      app.get('/userLoggedInAPI', (req, res) => {
        res.send([response.userName]);
      });

      app.get('/methodOfAnalysisAPI', (req, res) => {
        res.send([methodOfAnalysis]);
      });
    }
  }
  catch(e) {
    console.log(e)
  }
});

app.post('/login', async (req, res) => {
  try {
    const response = await req.body;
    const User = await models.User.findByLogin(response.userName);
    const sessionID = randomIdentifier();
    const methodOfAnalysis = 'full';

    const matchPasswords = await bcrypt.compare(response.password, User.password);

    if (User && matchPasswords) {
      const knownChars = await findAllKnownCharacters(response.userName);

      await models.User.update(
        {
          socketid: sessionID,
          methodOfAnalysis: methodOfAnalysis,
        },
        {where: {userName: response.userName}},
      );

      app.get('/KnownCharactersAPI', (req, res) => {
        res.send(knownChars);
      });

      app.get('/userLoggedInAPI', (req, res) => {
        res.send([response.userName]);
      });

      app.get('/methodOfAnalysisAPI', (req, res) => {
        res.send([methodOfAnalysis]);
      });
    }
  }
  catch(e) {
    console.log(e)
  }
});
*/

/*
io.use((socket, next) => {
  setTimeout(() => {
    // next is called after the client disconnection
    next();
  }, 1000);

  const token = socket.handshake.auth.token;
  console.log(token)
  socket.on("disconnect", () => {
    // not triggered
  });
});
*/



/*
  const getKnownCharactersAPI = () => {
    const url = process.env.REACT_APP_API_ENDPOINT+'/KnownCharactersAPI';

    fetch(url)
      .then((res) => res.json())
      .then((res) => {
        console.log(res)
        setknownCharacters(res);
      })
  }

  const getuserLoggedInAPI = () => {
    const url = process.env.REACT_APP_API_ENDPOINT+'/userLoggedInAPI';

    fetch(url)
      .then((res) => res.json())
      .then((res) => {
        console.log(res)
        setuserName(res[0]);
      })
  }

  const getmethodOfAnalysisAPI = () => {
    const url = process.env.REACT_APP_API_ENDPOINT+'/methodOfAnalysisAPI';

    fetch(url)
      .then((res) => res.json())
      .then((res) => {
        console.log(res)
        setmethodOfAnalysis(res[0]);
      })
  }

  useEffect(() => {
    const knownCharactersTemp = getKnownCharactersAPI();
    setknownCharacters(knownCharactersTemp)
    const userNameTemp = getuserLoggedInAPI();
    setuserName(userNameTemp)
    const methodOfAnalysisTemp = getmethodOfAnalysisAPI();
    setmethodOfAnalysis(methodOfAnalysisTemp)
  }, [methodOfAnalysis, userName, knownCharacters])

  async function postregisterAPI(data) {
    const url = process.env.REACT_APP_API_ENDPOINT+'/register';
    data.password = bcrypt.hashSync(data.password, '$2a$10$CwTycUXWue0Thq9StjUM0u');

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    .then(response => response.json())
    .catch((error) => { console.error(error) });
  };

  async function postloginAPI(data) {
    const url = process.env.REACT_APP_API_ENDPOINT+'/login';
    data.password = bcrypt.hashSync(data.password, '$2a$10$CwTycUXWue0Thq9StjUM0u');

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    .then(response => response.json())
    .catch((error) => { console.error(error) });
  };
*/
