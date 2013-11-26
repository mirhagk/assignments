using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Question2
{
    class Program
    {
        class Player
        {
            public string Name;
            public int ShootingPercent;
            public int Height;
            public int Rank;
            public int MinutesPlayed = 0;
            public Player(string[] parms)
            {
                Name = parms[0];
                ShootingPercent = int.Parse(parms[1]);
                Height = int.Parse(parms[2]);
            }
            public static int PlayerComparer(Player one, Player two)
            {
                if (one.ShootingPercent == two.ShootingPercent)
                    return two.Height.CompareTo(one.Height);
                return two.ShootingPercent.CompareTo(one.ShootingPercent);
            }
        }
        class Team
        {
            public List<Player> players = new List<Player>();
            public int MaxOnField;
            public List<Player> OnField = new List<Player>();
            public Team(IEnumerable<Player> players, int p)
            {
                MaxOnField = p;
                this.players = players.ToList();
                this.players.Sort((x, y) => x.Rank.CompareTo(y.Rank));
                while (OnField.Count < MaxOnField)
                    OnField.Add(this.players.First((x) => !OnField.Contains(x)));
            }
            public void AdvanceOneMinute()
            {
                foreach (var player in OnField)
                {
                    player.MinutesPlayed++;
                }
                if (players.Count > MaxOnField)
                {
                    var maxMinutes = OnField.Max((x) => x.MinutesPlayed);
                    var exitPlayer = OnField.Where((x) => x.MinutesPlayed == maxMinutes).OrderByDescending((x) => x.Rank).First();
                    OnField.Remove(exitPlayer);
                    var bench = players.Except(OnField);
                    var minMinutes = bench.Min((x) => x.MinutesPlayed);
                    var onPlayer = bench.Where((x) => x.MinutesPlayed == minMinutes).OrderBy((x) => x.Rank).First();
                    OnField.Add(onPlayer);
                }
            }
        }
        static string PrintLexoGraphic(IEnumerable<Player> players)
        {
            return string.Join(" ", players.OrderBy((x) => x.Name).Select((x)=>x.Name));
        }
        static void Main(string[] args)
        {
            var input = new StreamReader("input.txt");
            var output = new StreamWriter("output.txt");
            int t = int.Parse(input.ReadLine());
            for (int i = 0; i < t; i++)
            {
                string[] data = input.ReadLine().Split(' ');
                int n = int.Parse(data[0]);
                int m = int.Parse(data[1]);
                int p = int.Parse(data[2]);
                List<Player> players = new List<Player>();
                for (int x = 0; x < n; x++)
                {
                    players.Add(new Player(input.ReadLine().Split(' ')));
                }
                players.Sort(Player.PlayerComparer);
                for (int x = 0; x < n; x++)
                {
                    players[x].Rank = x+1;
                }
                Team one = new Team(players.Where((x, y) => y % 2 == 0), p);
                Team two = new Team(players.Where((x, y) => y % 2 == 1), p);
                for (int x = 0; x < m; x++)
                {
                    one.AdvanceOneMinute();
                    two.AdvanceOneMinute();
                }
                output.WriteLine("Case #{0}: {1}", i + 1, PrintLexoGraphic(one.OnField.Union(two.OnField)));
            }
            input.Close();
            output.Close();
        }
    }
}
