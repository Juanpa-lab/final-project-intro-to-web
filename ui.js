function showGameUI() {
    document.getElementById("lobby").classList.add("hidden");
    document.getElementById("playerInfo").classList.remove("hidden");
    document.getElementById("arena").classList.remove("hidden");
}

function updatePlayerDisplay(player, opponent) {
    document.getElementById("playerDisplay").textContent = player;
    document.getElementById("opponentDisplay").textContent = opponent || "Waiting...";
}

function drawGrid(size = 100) {
    const grid = document.getElementById("grid");
    grid.innerHTML = "";
    for (let i = 0; i < size; i++) {
        const cell = document.createElement("div");
        grid.appendChild(cell);
    }
}