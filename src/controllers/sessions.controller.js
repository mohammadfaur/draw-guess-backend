const playersModels = require('../models/players.models');
const sessionsModels = require('../models/sessions.models');

//create a new session in DB with the host player name.
const createNewSession = (req, res) => {
  const { playerName } = req.body;
  playersModels
    .setPlayerName(playerName)
    .then((playerId) => sessionsModels.setNewSession(playerId))
    .then((sessionId) => res.status(200).send({ sessionId: sessionId }))
    .catch((error) => res.status(500).send(error.message)); //internal server error
};

//report session status and guest player id(if exist)
const checkStatus = (req, res) => {
  const sessionId = req.params.sessionId;
  sessionsModels
    .getSessionInfo(sessionId)
    .then((sessionInfo) => {
      //check if session exist.
      if (!sessionInfo) {
        res.status(404).send('Page not found');
        return;
      }
      res.status(200).send({
        status: sessionInfo.status,
        hostName: sessionInfo.host_name,
        hostId: sessionInfo.id,
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send(error);
    });
};

//update chosen word in spesific session, by sessionID
const putCorrectWord = (req, res) => {
  const { chosenWord, sessionId } = req.body;
  sessionsModels
    .updateChosenWord(sessionId, chosenWord)
    .then(() => {
      res.status(200).send('success');
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Server internal error');
    });
};

//update chosen word in spesific session, by sessionID
const putDrawings = (req, res) => {
  const { drawData, sessionId } = req.body;
  sessionsModels
    .updateDraw(sessionId, drawData)
    .then(() => {
      res.status(200).send('success');
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Server internal error');
    });
};

//update winner name and score when the game session ends.
const putWinnerInstances = (req, res) => {
  const { sessionId } = req.body;
  sessionsModels
    .updateWinnerInstances(sessionId)
    .then(() => {
      res.status(200).send('success');
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Server internal error');
    });
};

//get draw data
const getSavedDraw = (req, res) => {
  const { sessionId } = req.body;
  sessionsModels
    .fetchSavedDraw(sessionId)
    .then((drawData) => {
      res.status(200).send(drawData);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Internal server error.');
    });
};

//check a guessing attempt.
const checkGuess = (req, res) => {
  const { sessionId, guessedWord } = req.body;
  sessionsModels
    .getChosenWord(sessionId)
    .then((correctWord) => {
      //the check ignores case sensitivity.
      if (correctWord.toLowerCase() === guessedWord.toLowerCase()) {
        res.status(200).send(true);
      } else {
        res.status(200).send(false);
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Internal server error.');
    });
};

//get session info
const getSessionData = (req, res) => {
  const { sessionId } = req.body;
  sessionsModels
    .fetchSessionInfo(sessionId)
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Internal server error.');
    });
};

module.exports = {
  createNewSession,
  checkStatus,
  putCorrectWord,
  putDrawings,
  putWinnerInstances,
  getSavedDraw,
  checkGuess,
  getSessionData,
};
