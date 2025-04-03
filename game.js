let playerName = "";

function createLobbyClicked() {
    playerName = document.getElementById("playerName").value || "Player1";
    const code = document.getElementById("lobbyCode").value || "1234";

    createLobby(playerName, code);
    showGame();
}

function joinLobbyClicked() {
    playerName = document.getElementById("playerName").value || "Player2";
    const code = document.getElementById("lobbyCode").value || "1234";

    joinLobby(playerName, code);
    showGame();
}

function showGame() {
    const opponent = getOpponent(playerName);
    showGameUI();
    updatePlayerDisplay(playerName, opponent);
    drawGrid();
}