const express = require('express');
const sessionsControllers = require('./controllers/sessions.controller');
const playersControllers = require('./controllers/players.controller');
const healthCheck = require('./services/healthCheck.service');

const router = express.Router();

router.post('/sessions/new', sessionsControllers.createNewSession);
router.put('/enter/guest/name', playersControllers.putGuestName);
router.put('/update/chosen/word', sessionsControllers.putCorrectWord);
router.put('/update/drawings', sessionsControllers.putDrawings);
router.put('/update/winner/score', sessionsControllers.putWinnerInstances);
router.post('/get/saved/draw', sessionsControllers.getSavedDraw);
router.post('/guess/attempt', sessionsControllers.checkGuess);
router.post('/session/data', sessionsControllers.getSessionData);
router.put('/update/session/status', sessionsControllers.updateSessionStatus);
router.get('/get/top/ten', sessionsControllers.getTopTenPlayersScore);
router.get('/status', healthCheck);

module.exports = router;
