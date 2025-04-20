function createTurnBanner() {
  const banner = document.createElement("div");
  banner.id = "yourTurnBanner";
  banner.style.marginTop = "10px";
  banner.style.fontSize = "1.2rem";
  banner.style.fontWeight = "bold";
  document.getElementById("turnBox").appendChild(banner);
  return banner;
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
      lobby.lastAction = `${currentPlayer} is defending!`;
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
  const log = document.getElementById("actionLog");
  if (log) {
    log.textContent = lobby.lastAction || "";
    const defendBtn = document.getElementById("defendBtn");
    if (defendBtn) defendBtn.disabled = (playerName !== currentPlayer || lobby.hasMoved);
  }

  const yourTurnBanner = document.getElementById("yourTurnBanner") || createTurnBanner();
  yourTurnBanner.textContent = playerName === currentPlayer ? "🎯 ¡Is your turn!" : "⏳ Waiting for the opponent...";
}

function drawGrid() {
  setupKeyboardMovement();
  loadLobbyFromStorage();
  createCellImage();
  currentPlayer = lobby.currentPlayer;

  if (lobby.playerHealth.Player1 <= 0 || lobby.playerHealth.Player2 <= 0) {
    const winner = lobby.playerHealth.Player1 <= 0 ? "Player2" : "Player1";

    // 📝 Guardar en historial
    const timestamp = new Date().toLocaleString();
    const matchRecord = `${timestamp} - ${winner} won`;
    let history = JSON.parse(localStorage.getItem("matchHistory") || "[]");
    history.push(matchRecord);
    localStorage.setItem("matchHistory", JSON.stringify(history));

    // 🖥️ Mostrar Game Over con opciones
    document.body.innerHTML = `
      <div style="text-align:center; margin-top:100px;">
        <h1>Game Over! ${winner} wins!</h1>
        <button onclick="restartGame()" style="padding: 10px 20px; font-size: 18px;">🔄 Restart Game</button>
        <button onclick="showMatchHistory()" style="padding: 10px 20px; font-size: 18px;">📜 View Match History</button>
      </div>`;
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
          <img src="soldiers/soldier1.png" />
          <div class="health-bar">
            <div class="health" style="width: ${lobby.playerHealth.Player1}%"></div>
          </div>
        </div>`;
    } else if (i === pos2) {
      cell.innerHTML = `
        <div class="unit">
          <img src="soldiers/soldier2.png" />
          <div class="health-bar">
            <div class="health" style="width: ${lobby.playerHealth.Player2}%"></div>
          </div>
        </div>`;
    }
    

    const opponent = currentPlayer === "Player1" ? "Player2" : "Player1";
    const pos = lobby.playerPositions[currentPlayer];
    const oppPos = lobby.playerPositions[opponent];
    const adjacent = [
      pos - 1, pos + 1, pos - 10, pos + 10,
      pos - 2, pos + 2, pos - 20, pos + 20
    ];

    if (adjacent.includes(oppPos) && i === oppPos && playerName === currentPlayer) {
      cell.classList.add("highlight");
      cell.addEventListener("click", () => {
        handleAttack(opponent, oppPos);
      });
    }

    if (playerName === currentPlayer && (isAvailableMove(i) || (adjacent.includes(oppPos) && i === oppPos))) {
      cell.classList.add("highlight");
      cell.addEventListener("click", () => {
        lobby.playerPositions[currentPlayer] = i;
        lobby.lastAction = `${currentPlayer} moved.`;
        lobby.currentPlayer = currentPlayer === "Player1" ? "Player2" : "Player1";
        lobby.hasMoved = false;
        lobby.playerDefending[currentPlayer] = false;
        saveLobbyToStorage();
        drawGrid();
      });
    }

    if (lobby.playerDefending.Player1 && i === pos1) cell.classList.add("defense-glow");
    if (lobby.playerDefending.Player2 && i === pos2) cell.classList.add("defense-glow");

    if (i === lobby.lastHitIndex) {
      cell.classList.add("flash-hit");
      setTimeout(() => cell.classList.remove("flash-hit"), 500);
    }

    grid.appendChild(cell);
  }
}


function setupKeyboardMovement() {
  if (setupKeyboardMovement.initialized) return;
  setupKeyboardMovement.initialized = true;

  document.onkeydown = (e) => {
    if (playerName !== currentPlayer || lobby.hasMoved) return;

    const pos = lobby.playerPositions[currentPlayer];
    let next = pos;

    switch (e.key.toLowerCase()) {
      case 'w': next = pos - 10; break; // up
      case 's': next = pos + 10; break; // down
      case 'a': next = pos - 1; break;  // left
      case 'd': next = pos + 1; break;  // right
      default: return;
    }

    if (isAvailableMove(next)) {
      lobby.playerPositions[currentPlayer] = next;
      lobby.lastAction = `${currentPlayer} moved.`;
      lobby.currentPlayer = currentPlayer === "Player1" ? "Player2" : "Player1";
      lobby.hasMoved = false;
      lobby.playerDefending[currentPlayer] = false;
      saveLobbyToStorage();
      drawGrid();
    }
  };
}

function createCellImage(imagePath) {
  const img = document.createElement('img');
  img.src = imagePath;
  img.style.width = '100%';
  img.style.height = '100%';
  img.draggable = false;
  return img;
}

function isAvailableMove(index) {
  const pos = lobby.playerPositions[currentPlayer];
  const moves = [pos - 1, pos + 1, pos - 10, pos + 10];
  return moves.includes(index) && index >= 0 && index < 100;
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


function handleAttack(opponent, oppPos) {
  const damage = lobby.playerDefending[opponent] ? 5 : 10;
  const newHP = lobby.playerHealth[opponent] - damage;
  lobby.playerHealth[opponent] = newHP > 0 ? newHP : 0;
  lobby.playerDefending[opponent] = false;
  lobby.lastAction = `${currentPlayer} attacked ${opponent} for ${damage} damage!`;
  lobby.lastHitIndex = oppPos;

  if (lobby.playerHealth[opponent] <= 0) {
    lobby.lastAction += ` ${opponent} has been defeated!`;
  } else {
    lobby.currentPlayer = opponent;
    lobby.hasMoved = false;
  }

  saveLobbyToStorage();
  drawGrid();
  updateTurnText();
}

function showMatchHistory() {
  document.getElementById("lobby").classList.add("hidden");
  document.getElementById("playerInfo").classList.add("hidden");
  document.getElementById("arena").classList.add("hidden");
  document.getElementById("turnBox").classList.add("hidden");

  const history = JSON.parse(localStorage.getItem("matchHistory") || "[]");
  const list = history.map(record => `<li>${record}</li>`).join("");

  const historyBox = document.createElement("div");
  historyBox.id = "historyBox";
  historyBox.innerHTML = `
    <h2>Match History</h2>
    <ul style="list-style:none; padding:0; font-size: 18px;">${list}</ul>
    <button onclick="location.reload()" style="margin-top:20px;">🔙 Back to Menu</button>
  `;
  document.body.appendChild(historyBox);
}


