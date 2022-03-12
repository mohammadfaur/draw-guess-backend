const db = require('../database/connection');

//create new game session.
const setNewSession = (playerId) =>
  db
    .query(`INSERT INTO sessions (host_player_id) VALUES($1) RETURNING id`, [
      playerId,
    ])
    .then(({ rows }) => rows[0].id);

//get the the host name,hostID, session status according to the session ID.
const getSessionInfo = (sessionId) =>
  db
    .query(
      `SELECT players.id, name as host_name, status 
      FROM sessions 
      JOIN players ON players.id = sessions.host_player_id 
      WHERE sessions.id = ${sessionId}`
    )
    .then(({ rows }) => rows[0]);

//update guestID in a session according to it id.
const updateGuestId = (sessionId, guestId) =>
  db.query(
    `UPDATE sessions SET guest_player_id = ($1) WHERE sessions.id = ($2)`,
    [guestId, sessionId]
  );

//update the chosen word in a session by sessionID
const updateChosenWord = (sessionId, pickedWord) =>
  db.query(`UPDATE sessions SET correct_word = ($1) WHERE sessions.id = ($2)`, [
    pickedWord,
    sessionId,
  ]);

//update drawings in a session by sessionID
const updateDraw = (sessionId, drawData) =>
  db.query(`UPDATE sessions SET draw_data = ($1) WHERE sessions.id = ($2)`, [
    drawData,
    sessionId,
  ]);

//update winner score and name in a game session by sessionID
const updateWinnerInstances = (sessionId) =>
  db
    .query(
      `
      SELECT name, score
      FROM (
      (SELECT name, score
        FROM sessions
        JOIN players ON players.id=sessions.host_player_id
        WHERE sessions.id = ($1))
     UNION
     (SELECT name, score
      FROM sessions
      JOIN players ON players.id=sessions.guest_player_id
      WHERE sessions.id = ($1))
      ) as players_session
      ORDER BY score DESC
      LIMIT 1;
`,
      [sessionId]
    )
    .then(({ rows }) => rows[0])
    .then(({ name, score }) =>
      db.query(
        `UPDATE sessions SET (winner_score, winner_name) = ($1, $2) WHERE sessions.id = ($3)`,
        [score, name, sessionId]
      )
    );

//get the saved draw from a session by sessionID.
const fetchSavedDraw = (sessionId) =>
  db
    .query(`SELECT draw_data FROM sessions WHERE sessions.id = ($1)`, [
      sessionId,
    ])
    .then(({ rows }) => rows[0].draw_data);

//get the chosen word.
const getChosenWord = (sessionId) =>
  db
    .query(`SELECT correct_word FROM sessions WHERE sessions.id = ($1)`, [
      sessionId,
    ])
    .then(({ rows }) => rows[0].correct_word);

const getSessionStatus = (sessionId) => {
  return db
    .query(`SELECT status, guest_player_id FROM sessions WHERE id=${sessionId}`)
    .then(({ rows }) => rows[0]);
};

module.exports = {
  setNewSession,
  getSessionInfo,
  updateGuestId,
  updateChosenWord,
  updateDraw,
  updateWinnerInstances,
  fetchSavedDraw,
  getChosenWord,
  getSessionStatus,
};
