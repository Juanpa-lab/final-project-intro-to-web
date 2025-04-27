let playerName = "";
let playerDisplayName = "";
let currentPlayer = "";
let lastVersion = 0;

function createLobbyClicked() {
  playerDisplayName = document.getElementById("playerName").value.trim() || "Player";
  const code = document.getElementById("lobbyCode").value.trim();

  if (!/^\d+$/.test(code)) {
    alert("Lobby code must be numbers only!");
    return;
  }

  playerRole = createLobby(playerDisplayName, code);
  playerName = playerDisplayName;
  showGame();
}


function joinLobbyClicked() {
  playerDisplayName = document.getElementById("playerName").value.trim() || "Player";
  const code = document.getElementById("lobbyCode").value.trim();

  if (!/^\d+$/.test(code)) {
    alert("Lobby code must be numbers only!");
    return;
  }

  playerRole = joinLobby(playerDisplayName, code);
  playerName = playerDisplayName;
  showGame();
}


function showGame() {
  loadLobbyFromStorage();
  currentPlayer = lobby.currentPlayer;
  lastVersion = lobby.version;

  showGameUI();
  const opponent = getOpponent(playerName);
  updatePlayerDisplay(playerDisplayName, opponent);
  drawGrid();
  updateTurnText();

  setInterval(() => {
    const oldVersion = lastVersion;
    loadLobbyFromStorage();

    if (lobby.version !== oldVersion) {
      currentPlayer = lobby.currentPlayer;
      lastVersion = lobby.version;
      updatePlayerDisplay(playerDisplayName, getOpponent(playerName));
      drawGrid();
      updateTurnText();
    }
  }, 500);
}

