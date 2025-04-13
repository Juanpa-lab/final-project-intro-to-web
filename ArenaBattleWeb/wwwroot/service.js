let lobby = {
  code: "",
  players: [],
  currentPlayer: "",
  version: 0,
  hasMoved: false,
  playerPositions: {
      Player1: 0,
      Player2: 99
  },
  playerHealth: {
      Player1: 100,
      Player2: 100
  },
  playerDefending: {
      Player1: false,
      Player2: false
  },
  lastAction: ""
};

function saveLobbyToStorage() {
  lobby.version = (lobby.version || 0) + 1;
  localStorage.setItem("lobby", JSON.stringify(lobby));
}

function loadLobbyFromStorage() {
  const stored = localStorage.getItem("lobby");
  if (stored) {
      lobby = JSON.parse(stored);
  }
}

function createLobby(name, code) {
  lobby.code = code;
  lobby.players = [name];
  lobby.currentPlayer = "Player1";
  lobby.hasMoved = false;
  lobby.playerPositions = { Player1: 0, Player2: 99 };
  lobby.playerHealth = { Player1: 100, Player2: 100 };
  lobby.playerDefending = { Player1: false, Player2: false };
  lobby.lastAction = "";
  lobby.version = 1;
  saveLobbyToStorage();
  return "Player1";
}

function joinLobby(name, code) {
  loadLobbyFromStorage();

  if (lobby.code === code) {
      if (!lobby.players.includes(name) && lobby.players.length < 2) {
          lobby.players.push(name);
          saveLobbyToStorage();
      }
  } else {
      return createLobby(name, code);
  }

  const index = lobby.players.indexOf(name);
  return index === 0 ? "Player1" : "Player2"; 
}

function getOpponent(currentPlayerName) {
  return lobby.players.find(p => p !== currentPlayerName);
}
