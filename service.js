let lobby = {
    code: "",
    players: []
};

function createLobby(name, code) {
    lobby.code = code;
    lobby.players = [name];
}

function joinLobby(name, code) {
    if (lobby.code === code) {
        if (!lobby.players.includes(name)) {
            lobby.players.push(name);
        }
    } else {
        createLobby(name, code);
    }
}

function getOpponent(currentPlayer) {
    return lobby.players.find(p => p !== currentPlayer);
}