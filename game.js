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

    // Create lobby and assign playerName as "Player1"
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

    // Join lobby and assign playerName as "Player1" or "Player2"
    playerName = joinLobby(playerDisplayName, code);
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
        loadLobbyFromStorage();
        if (lobby.version !== lastVersion) {
            lastVersion = lobby.version;
            currentPlayer = lobby.currentPlayer;
            updateTurnText();
            drawGrid();
            const opp = getOpponent(playerName);
            updatePlayerDisplay(playerDisplayName, opp);
        }
    }, 1000);
}
