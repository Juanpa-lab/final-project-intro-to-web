function drawGrid() {
    const grid = document.getElementById("grid");
    grid.innerHTML = "";
  
    const currentPlayer = gameState.currentTurn;
    const currentPosition = gameState.positions[currentPlayer];
    const availableMoves = getAvailableMoves(currentPosition);
  
    for (let i = 0; i < 100; i++) {
      const cell = document.createElement("div");
  
      if (i === gameState.positions[1]) {
        cell.classList.add("player1");
      }
      if (i === gameState.positions[2]) {
        cell.classList.add("player2");
      }
  
      if (i !== currentPosition && availableMoves.includes(i)) {
        cell.classList.add("move-option");
        cell.onclick = () => movePlayer(currentPlayer, i); 
      }
  
      grid.appendChild(cell);
    }
  
    document.getElementById("turnDisplay").textContent = `Turn: Player ${currentPlayer}`;
  }
  