let playerName = "";

function createLobbyClicked() {
    playerName = document.getElementById("playerName").value.trim() || "Player1";
    const code = document.getElementById("lobbyCode").value.trim();

    if (!/^\d+$/.test(code)) {
        alert("Lobby code must be numbers only!");
        return;
    }

    createLobby(playerName, code);
    showGame();
}

function joinLobbyClicked() {
    playerName = document.getElementById("playerName").value.trim() || "Player2";
    const code = document.getElementById("lobbyCode").value.trim();

    if (!/^\d+$/.test(code)) {
        alert("Lobby code must be numbers only!");
        return;
    }

    joinLobby(playerName, code);
    showGame();
}

function showGame() {
    const opponent = getOpponent(playerName);
    showGameUI();
    updatePlayerDisplay(playerName, opponent);
    drawGrid();
}