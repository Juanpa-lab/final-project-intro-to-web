let lobby = {
    code: "",
    players: []
};

function saveLobbyToStorage() {
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
    saveLobbyToStorage();
}

function joinLobby(name, code) {
    loadLobbyFromStorage();

    if (lobby.code === code) {
        if (!lobby.players.includes(name) && lobby.players.length < 2) {
            lobby.players.push(name);
            saveLobbyToStorage();
        }
    } else {
        createLobby(name, code);
    }
}

function getOpponent(currentPlayer) {
    return lobby.players.find(p => p !== currentPlayer);
}