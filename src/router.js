const express = require('express');
const sessionsControllers = require('./controllers/sessions.controller');
const playersControllers = require('./controllers/players.controller');

const router = express.Router();

router.post('/sessions/new', sessionsControllers.createNewSession);
router.get('/session/:sessionId', sessionsControllers.checkStatus);
router.put('/enter/guest/name', playersControllers.putGuestName);
router.put('/update/chosen/word', sessionsControllers.putCorrectWord);
router.put('/update/drawings', sessionsControllers.putDrawings);
router.put('/update/player/score', playersControllers.putPlayerScore);
router.put('/update/winner/score', sessionsControllers.putWinnerInstances);
router.post('/get/saved/draw', sessionsControllers.getSavedDraw);
router.post('/guess/attempt', sessionsControllers.checkGuess);

router.get('/health', (req, res) => {
  const status = {
    uptime: process.uptime(),
    date: new Date(),
    message: 'Ok',
  };
  res.status(200).send(status);
});

module.exports = router;
