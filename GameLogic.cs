public class Lobby
{
    public string Code { get; set; }
    public List<string> Players { get; set; } = new();

    public void AddPlayer(string name)
    {
        if (!Players.Contains(name) && Players.Count < 2)
        {
            Players.Add(name);
        }
    }

    public string GetOpponent(string player)
    {
        return Players.FirstOrDefault(p => p != player);
    }
}