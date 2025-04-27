function setupKeyboardMovement() {
  document.removeEventListener('keydown', handleKeyDown);
  document.addEventListener('keydown', handleKeyDown);
}

function handleKeyDown(e) {
  loadLobbyFromStorage();

  if (playerRole !== lobby.currentPlayer || lobby.hasMoved) return;

  const pos = lobby.playerPositions[playerRole];
  let next = pos;

  switch (e.key.toLowerCase()) {
    case 'w': next = pos - 10; break;
    case 's': next = pos + 10; break;
    case 'a': next = pos - 1; break;
    case 'd': next = pos + 1; break;
    default: return;
  }

  if (isAvailableMove(next)) {
    lobby.playerPositions[playerRole] = next;
    lobby.lastAction = `${playerRole} moved with keyboard.`;

    lobby.currentPlayer = playerRole === "Player1" ? "Player2" : "Player1";
    lobby.hasMoved = false;
    lobby.playerDefending[playerRole] = false;

    saveLobbyToStorage();
    loadLobbyFromStorage();
    drawGrid();
    updateTurnText();
  }
}



function isAvailableMove(index) {
  const pos = lobby.playerPositions[currentPlayer];
  const moves = [pos - 1, pos + 1, pos - 10, pos + 10];
  return moves.includes(index) && index >= 0 && index < 100;
}

function createCellImage(imagePath) {
  const img = document.createElement('img');
  img.src = imagePath;
  img.style.width = '100%';
  img.style.height = '100%';
  img.draggable = false;
  return img;
}

function drawGrid() {
  setupKeyboardMovement();
  loadLobbyFromStorage();
  currentPlayer = lobby.currentPlayer;

  if (lobby.playerHealth.Player1 <= 0 || lobby.playerHealth.Player2 <= 0) {
    const winner = lobby.playerHealth.Player1 <= 0 ? "Player2" : "Player1";
    document.body.innerHTML = `
      <div style="text-align:center; margin-top:100px;">
        <h1>Game Over! ${winner} wins!</h1>
        <button onclick="restartGame()" style="padding: 10px 20px; font-size: 18px;">🔄 Restart Game</button>
      </div>
    `;
    return;
  }

  const grid = document.getElementById("grid");
  grid.innerHTML = "";

  for (let i = 0; i < 100; i++) {
    const cell = document.createElement("div");
    cell.dataset.index = i;

    const pos1 = lobby.playerPositions.Player1;
    const pos2 = lobby.playerPositions.Player2;

    if (i === pos1) {
      cell.innerHTML = `
        <div class="unit">
          <img src="soldiers/soldier1.png" draggable="true" ondragstart="handleDragStart(event)" />
          <div class="health-bar">
            <div class="health player1-health" style="width: ${lobby.playerHealth.Player1}%"></div>
          </div>
          <p>${lobby.playerHealth.Player1} HP</p>
        </div>`;
    } else if (i === pos2) {
      cell.innerHTML = `
        <div class="unit">
          <img src="soldiers/soldier2.png" draggable="true" ondragstart="handleDragStart(event)" />
          <div class="health-bar">
            <div class="health player2-health" style="width: ${lobby.playerHealth.Player2}%"></div>
          </div>
          <p>${lobby.playerHealth.Player2} HP</p>
        </div>`;
    }

    const opponent = playerRole === "Player1" ? "Player2" : "Player1";
    const pos = lobby.playerPositions[playerRole];
    const oppPos = lobby.playerPositions[opponent];

    const adjacent = [
      pos - 1, pos + 1, pos - 10, pos + 10,
      pos - 2, pos + 2, pos - 20, pos + 20
    ];

    if (playerRole === lobby.currentPlayer) {
      if (adjacent.includes(oppPos) && i === oppPos) {
        cell.classList.add("highlight");
        cell.addEventListener("click", () => {
          handleAttack(opponent, oppPos);
        });
      }

      if (isAvailableMove(i)) {
        cell.classList.add("highlight");
        cell.addEventListener("click", () => {
          lobby.playerPositions[playerRole] = i;
          lobby.lastAction = `${playerRole} moved.`;
          lobby.currentPlayer = playerRole === "Player1" ? "Player2" : "Player1";
          lobby.hasMoved = false;
          lobby.playerDefending[playerRole] = false;
          saveLobbyToStorage();
          drawGrid();
          updateHealthBars();
          updateTurnText();
        });
      }
    }

    cell.addEventListener("drop", handleDrop);
    cell.addEventListener("dragover", handleDragOver);

    grid.appendChild(cell);
  }
}


function handleAttack(opponent, oppPos) {
  loadLobbyFromStorage();

  if (playerRole !== lobby.currentPlayer || lobby.hasMoved) return;

  const damage = lobby.playerDefending[opponent] ? 5 : 10;
  lobby.playerHealth[opponent] = Math.max(0, lobby.playerHealth[opponent] - damage);
  lobby.playerDefending[opponent] = false;
  lobby.lastAction = `${playerRole} attacked ${opponent} for ${damage} damage!`;
  lobby.lastHitIndex = oppPos;

  if (lobby.playerHealth[opponent] <= 0) {
    lobby.lastAction += ` ${opponent} has been defeated!`;
  }

  lobby.currentPlayer = opponent;
  lobby.hasMoved = false;

  saveLobbyToStorage();
  drawGrid();
  updateHealthBars();
  updateTurnText();
}


function updateHealthBars() {
  const health1 = document.querySelector(".player1-health");
  const health2 = document.querySelector(".player2-health");

  if (health1) {
    const hp1 = lobby.playerHealth.Player1;
    health1.style.width = `${hp1}%`;
    health1.style.backgroundColor = getHealthColor(hp1);
  }

  if (health2) {
    const hp2 = lobby.playerHealth.Player2;
    health2.style.width = `${hp2}%`;
    health2.style.backgroundColor = getHealthColor(hp2);
  }
}

function getHealthColor(hp) {
  if (hp > 50) {
    return "green";
  } else if (hp > 20) {
    return "yellow";
  } else {
    return "red";
  }
}




function updatePlayerDisplay(player, opponent) {
  const healthText = `${lobby.playerHealth[player] || 100} HP`;
  const oppHealthText = opponent ? `${lobby.playerHealth[opponent] || 100} HP` : "Waiting...";
  const shield = lobby.playerDefending[player] ? ' 🛡️' : '';
  const oppShield = opponent && lobby.playerDefending[opponent] ? ' 🛡️' : '';

  document.getElementById("playerDisplay").textContent = `${player} - ${healthText}${shield}`;
  document.getElementById("opponentDisplay").textContent = opponent ? `${opponent} - ${oppHealthText}${oppShield}` : "Waiting...";
}

function updateTurnText() {
  document.getElementById("turnDisplay").textContent = `${currentPlayer}'s Turn`;
  const yourTurnBanner = document.getElementById("yourTurnBanner") || createTurnBanner();
  yourTurnBanner.textContent = playerName === currentPlayer ? "🎯 Your turn!" : "⏳ Waiting...";
}

function showMatchHistory() {
  document.getElementById("lobby").classList.add("hidden");
  document.getElementById("playerInfo").classList.add("hidden");
  document.getElementById("arena").classList.add("hidden");
  document.getElementById("turnBox").classList.add("hidden");

  const history = JSON.parse(localStorage.getItem("matchHistory") || "[]");

  const filteredHistory = history.filter(record => record.includes("won"));
  const list = filteredHistory.map(record => `<li>${record}</li>`).join("");

  const historyBox = document.createElement("div");
  historyBox.id = "historyBox";
  historyBox.innerHTML = `
    <h2>Match History</h2>
    <ul style="list-style:none; padding:0; font-size: 18px;">${list}</ul>
    <button onclick="location.reload()" style="margin-top:20px;">🔙 Back to Menu</button>
  `;
  document.body.appendChild(historyBox);
}

function restartGame() {
  lobby.playerHealth = { Player1: 100, Player2: 100 };
  lobby.playerDefending = { Player1: false, Player2: false };
  lobby.playerPositions = { Player1: 0, Player2: 99 };
  lobby.currentPlayer = "Player1";
  lobby.hasMoved = false;
  lobby.lastAction = "Game restarted.";
  saveLobbyToStorage();
  location.reload();
}

function createTurnBanner() {
  const banner = document.createElement("div");
  banner.id = "yourTurnBanner";
  banner.style.marginTop = "10px";
  banner.style.fontSize = "1.2rem";
  banner.style.fontWeight = "bold";
  document.getElementById("turnBox").appendChild(banner);
  return banner;
}

function handleDragStart(event) {
  event.dataTransfer.setData("text/plain", event.target.parentElement.parentElement.dataset.index);
}

function handleDrop(event) {
  event.preventDefault();
  loadLobbyFromStorage(); // Always reload fresh data

  const fromIndex = parseInt(event.dataTransfer.getData("text/plain"));
  const toIndex = parseInt(event.target.dataset.index);

  if (playerRole !== lobby.currentPlayer || lobby.hasMoved) return;

  if (isAvailableMove(toIndex)) {
    lobby.playerPositions[lobby.currentPlayer] = toIndex;
    lobby.lastAction = `${lobby.currentPlayer} moved by dragging.`;

    lobby.currentPlayer = lobby.currentPlayer === "Player1" ? "Player2" : "Player1";
    lobby.hasMoved = false;
    lobby.playerDefending[playerRole] = false;

    saveLobbyToStorage();
    drawGrid();
    updateTurnText();
  }
}



function handleDragOver(event) {
  event.preventDefault();
}

function showGameUI() {
  document.getElementById("lobby").classList.add("hidden");
  document.getElementById("playerInfo").classList.remove("hidden");
  document.getElementById("arena").classList.remove("hidden");
  document.getElementById("turnBox").classList.remove("hidden");

  if (!document.getElementById("defendBtn")) {
    const defendBtn = document.createElement("button");
    defendBtn.id = "defendBtn";
    defendBtn.textContent = "Defend";
    defendBtn.onclick = () => {
      lobby.playerDefending[currentPlayer] = true;
      lobby.hasMoved = true;
      lobby.lastAction = `${currentPlayer} is defending!`;
      saveLobbyToStorage();
      drawGrid();
    };
    document.getElementById("turnBox").appendChild(defendBtn);
  }

  if (!document.getElementById("actionLog")) {
    const log = document.createElement("div");
    log.id = "actionLog";
    log.style.marginTop = "1rem";
    log.style.fontWeight = "bold";
    document.getElementById("turnBox").appendChild(log);
  }

  if (!document.getElementById("yourTurnBanner")) {
    const banner = document.createElement("div");
    banner.id = "yourTurnBanner";
    banner.style.marginTop = "10px";
    banner.style.fontSize = "1.2rem";
    banner.style.fontWeight = "bold";
    document.getElementById("turnBox").appendChild(banner);
  }
}

