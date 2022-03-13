const playerModels = require('../models/players.models');
const sessionModels = require('../models/sessions.models');

//update Guest Name in a game session by sessionID.
const putGuestName = (req, res) => {
  const { playerName, sessionId } = req.body;
  playerModels
    .setPlayerName(playerName)
    .then((guestId) => sessionModels.updateGuestId(sessionId, guestId))
    .then((guestId) => res.status(200).send(guestId))
    .catch((error) => res.status(500).send(error.message));
};

//update players score.
const putPlayerScore = (req, res) => {
  const { sessionId, playerId, correctWord } = req.body;
  //check if the fetched word is really correct
  sessionModels
    .getChosenWord(sessionId)
    .then((chosenWord) => {
      if (chosenWord.toLowerCase() !== correctWord.toLowerCase()) {
        res.status(401).send('unauthorized action.');
        return;
      }
      return;
    })
    .then(() => {
      return playerModels.getPlayerScore(playerId);
      //determine the score.
    })
    .then((prevScore) => {
      let score = 0;
      ((fetchedWord) => {
        const length = fetchedWord.length;
        if (length < 4) {
          score = 1;
        } else if (length >= 4 && length < 7) {
          score = 3;
        } else {
          score = 5;
        }
      })(correctWord);
      //fetch the score to the DB.
      return playerModels.updatePlayerScore(playerId, prevScore + score);
    })
    .then(() => {
      res.status(200).send('success');
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Internal server error');
    });
};

module.exports = { putGuestName, putPlayerScore };
