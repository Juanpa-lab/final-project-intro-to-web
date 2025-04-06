let lobby = {
    code: "",
    players: []
  };
  
  let gameState = {
    currentTurn: 1,
    positions: {
      1: 0,  // Player 1 starts at cell 0
      2: 99  // Player 2 starts at cell 99
    }
  };
  
  function createLobby(name, code) {
    lobby.code = code;
    lobby.players = [name];
    localStorage.setItem("lobby", JSON.stringify(lobby));
  }
  
  function joinLobby(name, code) {
    const stored = localStorage.getItem("lobby");
    if (stored) lobby = JSON.parse(stored);
  
    if (lobby.code === code) {
      if (!lobby.players.includes(name) && lobby.players.length < 2) {
        lobby.players.push(name);
        localStorage.setItem("lobby", JSON.stringify(lobby));
      }
    } else {
      createLobby(name, code);
    }
  }
  
  function getOpponent(currentPlayer) {
    return lobby.players.find(p => p !== currentPlayer);
  }
  
  function getAvailableMoves(position) {
    const moves = [];
    if (position % 10 > 0) moves.push(position - 1);     // left
    if (position % 10 < 9) moves.push(position + 1);     // right
    if (position >= 10) moves.push(position - 10);       // up
    if (position < 90) moves.push(position + 10);        // down
    return moves;
  }