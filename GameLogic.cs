using System;
using System.Collections.Generic;
using System.Linq;

public class Lobby
{
    public string Code { get; set; }
    public List<string> Players { get; private set; } = new();
    public string CurrentTurn { get; private set; } = "Player1";
    public Dictionary<string, int> PlayerPositions { get; private set; } = new()
    {
        { "Player1", 0 },
        { "Player2", 99 }
    };
    public bool AddPlayer(string name)
    {
        if (Players.Count >= 2 || Players.Contains(name))
            return false;

        Players.Add(name);
        return true;
    }
    public string GetOpponent(string current)
    {
        return Players.FirstOrDefault(p => p != current);
    }
    public void EndTurn()
    {
        CurrentTurn = CurrentTurn == "Player1" ? "Player2" : "Player1";
    }
    public bool IsValidMove(int targetIndex)
    {
        int currentIndex = PlayerPositions[CurrentTurn];
        int row = currentIndex / 10;
        int col = currentIndex % 10;

        int targetRow = targetIndex / 10;
        int targetCol = targetIndex % 10;

        int rowDiff = Math.Abs(row - targetRow);
        int colDiff = Math.Abs(col - targetCol);

        return (rowDiff + colDiff == 1) && targetIndex >= 0 && targetIndex < 100;
    }
    public bool MovePlayer(int targetIndex)
    {
        if (!IsValidMove(targetIndex)) return false;

        PlayerPositions[CurrentTurn] = targetIndex;
        return true;
    }
    public bool IsReady()
    {
        return Players.Count == 2;
    }
}
