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

  playerName = createLobby(playerDisplayName, code);
  showGame();
}

function joinLobbyClicked() {
  playerDisplayName = document.getElementById("playerName").value.trim() || "Player";
  const code = document.getElementById("lobbyCode").value.trim();

  if (!/^\d+$/.test(code)) {
    alert("Lobby code must be numbers only!");
    return;
  }

  playerName = joinLobby(playerDisplayName, code); // ✅ FIXED HERE
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

  let playerWasConnected = false;

  setInterval(() => {
    loadLobbyFromStorage();
    currentPlayer = lobby.currentPlayer;

    if (playerName === currentPlayer) {
      drawGrid();
      updateTurnText();
    }

    if (lobby.players.length === 2) {
      playerWasConnected = true;
    }

    if (playerWasConnected && lobby.players.length < 2) {
      alert("⚠️ Your opponent has disconnected or left the game.");
      playerWasConnected = false;
    }
  }, 1000);
}
